import type { ApiContext } from "../context";
import {
  type Balances,
  ChainId,
  type NftConnection,
  type NftFiltersInput,
  type TransactionConnection,
} from "../types";

import { Ethereum } from "./ethereum";
import { Solana } from "./solana";

export interface Blockchain {
  getBalancesForAddress(address: string): Promise<Balances>;
  getNftsForAddress(
    address: string,
    filters?: Partial<NftFiltersInput>
  ): Promise<NftConnection>;
  getTransactionsForAddress(
    address: string,
    before?: string,
    after?: string
  ): Promise<TransactionConnection>;
  id(): ChainId;
  nativeDecimals(): number;
}

/**
 * Factory function for returning an instance of `Blockchain` based
 * on the enum variant argued.
 * @export
 * @param {ChainId} id
 * @returns {Blockchain}
 */
export function getBlockchainForId(id: ChainId, ctx: ApiContext): Blockchain {
  switch (id) {
    case ChainId.Ethereum: {
      return new Ethereum(ctx);
    }
    case ChainId.Solana: {
      return new Solana(ctx);
    }
  }
}
