import { useEffect, useState } from "react";
import {
  SolanaCluster,
  UI_RPC_METHOD_SOLANA_CONNECTION_URL_UPDATE,
} from "@coral-xyz/common";
import { PushDetail } from "@coral-xyz/react-common";
import { useBackgroundClient, useSolanaConnectionUrl } from "@coral-xyz/recoil";
import { useCustomTheme } from "@coral-xyz/themes";
import { Check } from "@mui/icons-material";

import { useNavigation } from "../../../../common/Layout/NavStack";
import { SettingsList } from "../../../../common/Settings/List";

export function PreferencesSolanaConnection() {
  const background = useBackgroundClient();
  const currentUrl = useSolanaConnectionUrl();
  const nav = useNavigation();
  const [allRPCs, setAllRPCs] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    nav.setOptions({ headerTitle: "RPC Connection" });

    // Load custom RPCs from Chrome storage
    chrome.storage.local.get("allRPCs", (data) => {
      if (data.allRPCs) {
        setAllRPCs(data.allRPCs);
      } else {
        // Set initial predefined networks
        const predefinedNetworks = [
          { name: "Mainnet (Beta)", url: SolanaCluster.MAINNET },
          { name: "Devnet", url: SolanaCluster.DEVNET },
          { name: "Localnet", url: SolanaCluster.LOCALNET },
          { name: "Cascade", url: SolanaCluster.CASCADE },
        ];
        void chrome.storage.local.set({ allRPCs: predefinedNetworks });
        setAllRPCs(predefinedNetworks);
      }
    });
  }, [nav]);

  const menuItems: Record<string, any> = {};

  allRPCs.forEach((rpc) => {
    menuItems[rpc.name] = {
      onClick: () => changeNetwork(rpc.url),
      detail: currentUrl === rpc.url ? <Checkmark /> : null,
    };
  });

  menuItems["Custom"] = {
    onClick: () => {
      nav.push("preferences-solana-edit-rpc-connection", {
        onAdd: addCustomRPC,
      });
    },
    detail: <PushDetail />,
  };

  const changeNetwork = (url: string) => {
    try {
      background
        .request({
          method: UI_RPC_METHOD_SOLANA_CONNECTION_URL_UPDATE,
          params: [url],
        })
        .catch(console.error);
    } catch (err) {
      console.error(err);
    }
  };

  const addCustomRPC = (name: string, url: string) => {
    // Add the new custom RPC to Chrome storage and update the state
    const updatedRPCs = [...allRPCs, { name, url }];
    void chrome.storage.local.set({ allRPCs: updatedRPCs });
    setAllRPCs(updatedRPCs);
  };

  return <SettingsList menuItems={menuItems} />;
}

export function Checkmark() {
  const theme = useCustomTheme();
  return (
    <Check
      style={{
        color: theme.custom.colors.brandColor,
      }}
    />
  );
}
