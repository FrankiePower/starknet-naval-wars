import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";
import { shortString } from "starknet";

/**
 * Deploy a contract using the specified parameters.
 *
 * @example (deploy contract with constructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       constructorArgs: {
 *         owner: deployer.address,
 *       },
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 * @example (deploy contract without constructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 *
 * @returns {Promise<void>}
 */
// const deployScript = async (): Promise<void> => {
//   await deployContract({
//     contract: "DefenceToken",
//     constructorArgs: {
//       name: "DefenceToken",
//       symbol: "DEF",
//       fixed_supply: "10000000000000000000000000", // 10,000,000 tokens with 18 decimals
//       recipient: deployer.address, // or any address you want to receive the initial supply
//     },
//   });
// };

const deployScript = async (): Promise<void> => {
  await deployContract({
    contract: "BattleContract",
    constructorArgs: {
      owner: deployer.address,
      defence_token: "0x68ed7cae9c0f619a5b66a6a762c32861bfb8cd22f75d1436928c75c6e6b1d6a",
      },
  });
};


const main = async (): Promise<void> => {
  try {
    await deployScript();
    await executeDeployCalls();
    exportDeployments();

    console.log(green("All Setup Done!"));
  } catch (err) {
    console.log(err);
    process.exit(1); //exit with error so that non subsequent scripts are run
  }
};

main();
