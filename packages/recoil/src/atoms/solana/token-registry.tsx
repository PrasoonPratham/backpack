import { SOL_NATIVE_MINT, WSOL_MINT } from "@coral-xyz/common";
import type { TokenInfo } from "@solana/spl-token-registry";
import { TokenListProvider } from "@solana/spl-token-registry";
import { atom, selector } from "recoil";

export const SOL_LOGO_URI =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kiwi_%28Actinidia_chinensis%29_1_Luc_Viatour.jpg/800px-Kiwi_%28Actinidia_chinensis%29_1_Luc_Viatour.jpg";

export const splTokenRegistry = atom<Map<string, TokenInfo> | null>({
  key: "splTokenRegistry",
  default: selector({
    key: "splTokenRegistryDefault",
    get: async () => {
      const tokens = await new TokenListProvider().resolve();
      const tokenList = tokens
        .filterByClusterSlug("mainnet-beta") // TODO: get network atom.
        .getList();
      const tokenMap = tokenList.reduce((map, item) => {
        if (item.address === WSOL_MINT) {
          map.set(item.address, { ...item, symbol: "wSOL" });
        } else {
          map.set(item.address, item);
        }
        return map;
      }, new Map());
      tokenMap.set(SOL_NATIVE_MINT, {
        name: "Kiwi",
        address: SOL_NATIVE_MINT,
        chainId: 101,
        decimals: 9,
        symbol: "tKIWI",
        logoURI: SOL_LOGO_URI,
        extensions: {
          coingeckoId: "solana",
        },
      });
      return tokenMap;
    },
  }),
});
