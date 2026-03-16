import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @title BlockchainService
 * @dev Service for interacting with the Street Mobilization smart contracts.
 */
class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x...', this.provider);
  }

  /**
   * Loads a contract instance using its ABI and address.
   * @param address The contract address.
   * @param abi The contract ABI.
   * @returns The contract instance.
   */
  public getContract(address: string, abi: any): ethers.Contract {
    return new ethers.Contract(address, abi, this.wallet);
  }

  /**
   * Submits a transaction to register a child on the blockchain.
   * @param contractAddress Registry contract address.
   * @param abi Registry ABI.
   * @param childId The child's system ID.
   * @param bioHash The child's biometric hash.
   * @param dataHash The off-chain data hash (IPFS).
   * @returns Transaction receipt.
   */
  public async registerChildOnChain(
    contractAddress: string,
    abi: any,
    childId: string,
    bioHash: string,
    dataHash: string
  ): Promise<any> {
    const contract = this.getContract(contractAddress, abi);
    const tx = await contract.registerChild(childId, bioHash, dataHash);
    return await tx.wait();
  }

  /**
   * Verifies if a child exists on the blockchain using their biometric hash.
   * @param contractAddress Registry contract address.
   * @param abi Registry ABI.
   * @param bioHash The biometric hash to check.
   * @returns Boolean indicating if the child is registered.
   */
  public async verifyChildOnChain(contractAddress: string, abi: any, bioHash: string): Promise<boolean> {
    const contract = this.getContract(contractAddress, abi);
    return await contract.isBiometricRegistered(bioHash);
  }
}

export default new BlockchainService();
