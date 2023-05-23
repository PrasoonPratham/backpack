import { SOL_NATIVE_MINT, WSOL_MINT } from "@coral-xyz/common";
// import {
//   useSolanaConnectionUrl,
// } from "@coral-xyz/recoil";
import type { TokenInfo } from "@solana/spl-token-registry";
import { TokenListProvider } from "@solana/spl-token-registry";
import { atom, selector } from "recoil";

// eslint-disable-next-line react-hooks/rules-of-hooks
// const connectionUrl = useSolanaConnectionUrl();

export const SOL_LOGO_URI =
  "https://nautchain.xyz/media/nuatchain_media_kit/naut_sq.png";

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
        name: "Nautilus",
        address: SOL_NATIVE_MINT,
        chainId: 101,
        decimals: 9,
        symbol: "tZBC",
        logoURI: SOL_LOGO_URI,
        extensions: {
          coingeckoId: "solana",
        },
      });
      return tokenMap;
    },
  }),
});
