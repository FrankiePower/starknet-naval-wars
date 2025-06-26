use starknet::ContractAddress;

#[starknet::interface]
pub trait IBattleContract<TContractState> {
    fn fight_battle(ref self: TContractState, loot: u256);
    fn set_winner(ref self: TContractState, winner: ContractAddress);
    fn withdraw_loot(ref self: TContractState);
    fn get_defence_token(self: @TContractState)-> ContractAddress;
}

#[starknet::contract]
pub mod BattleContract {
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::IBattleContract;

    const ZERO_ADDRESS: ContractAddress = 0x0.try_into().unwrap();

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        GameStarted: GameStarted,
        GameWon: GameWon,
    }

    #[derive(Drop, starknet::Event)]
    struct GameStarted {
        player: ContractAddress,
        loot: u256,
    }
    #[derive(Drop, starknet::Event)]
    struct GameWon {
        winner: ContractAddress,
        loot: u256,
    }

    #[storage]
    struct Storage {
        defence_token: ContractAddress,
        // Each player address maps to their loot amount (0 if not playing)
        player_loot: Map<ContractAddress, u256>,
        // Each player address maps to their winner status (true if won, false/none otherwise)
        player_winner: Map<ContractAddress, bool>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, owner: ContractAddress, defence_token: ContractAddress,
    ) {
        self.ownable.initializer(owner);
        self.defence_token.write(defence_token);
    }

    #[abi(embed_v0)]
    impl BattleContractImpl of IBattleContract<ContractState> {
        fn fight_battle(ref self: ContractState, loot: u256) {
            // Each address can only have one active game at a time
            assert(self.player_loot.read(get_caller_address()) == 0_u256, 'Already playing');
            let defence_token: ContractAddress = self.defence_token.read();
            let token_dispatcher = IERC20Dispatcher { contract_address: defence_token };
            token_dispatcher.transfer_from(get_caller_address(), get_contract_address(), loot);
            self.player_loot.write(get_caller_address(), loot);
            self.player_winner.write(get_caller_address(), false);
            self.emit(GameStarted { player: get_caller_address(), loot });
        }
        fn set_winner(ref self: ContractState, winner: ContractAddress) {
            self.ownable.assert_only_owner();
            // Only allow setting winner if player has an active game
            assert(self.player_loot.read(winner) > 0_u256, 'No active game for winner');
            self.player_winner.write(winner, true);
            self.emit(GameWon { winner, loot: self.player_loot.read(winner) * 2_u256 });
        }
        fn withdraw_loot(ref self: ContractState) {
            let caller = get_caller_address();
            let is_winner = self.player_winner.read(caller);
            assert(is_winner, 'Not winner');
            let loot = self.player_loot.read(caller);
            assert(loot > 0_u256, 'No loot to withdraw');
            let defence_token: ContractAddress = self.defence_token.read();
            let token_dispatcher = IERC20Dispatcher { contract_address: defence_token };
            let payout = loot * 2_u256;
            token_dispatcher.transfer(caller, payout);
            // Reset player state
            self.player_loot.write(caller, 0_u256);
            self.player_winner.write(caller, false);
        }

        fn get_defence_token(self: @ContractState) -> ContractAddress {
            let token_address: ContractAddress = self.defence_token.read();
            token_address
        }
    }
}
