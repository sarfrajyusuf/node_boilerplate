import type { blockchain } from "@/api/blockchain/blockchain.model";
import Blockchain from "@/api/blockchain/blockchain.schema";

export class BlockchainRepository {
  async findAllAsync(): Promise<blockchain[] | null> {
    return (await Blockchain.findAll()) || null;
  }
}
