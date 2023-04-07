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
  const [customRPCs, setCustomRPCs] = useState<{ name: string; url: string }[]>(
    []
  );

  useEffect(() => {
    nav.setOptions({ headerTitle: "RPC Connection" });

    // Load custom RPCs from local storage
    const storedRPCs = localStorage.getItem("customRPCs");
    if (storedRPCs) {
      setCustomRPCs(JSON.parse(storedRPCs));
    }
  }, [nav]);

  const menuItems: Record<string, any> = {};

  const predefinedNetworks: Record<string, string> = {
    "Mainnet (Beta)": SolanaCluster.MAINNET,
    Devnet: SolanaCluster.DEVNET,
    Localnet: SolanaCluster.LOCALNET,
    Cascade: SolanaCluster.CASCADE,
  };

  for (const network in predefinedNetworks) {
    menuItems[network] = {
      onClick: () => changeNetwork(predefinedNetworks[network]),
      detail: currentUrl === predefinedNetworks[network] ? <Checkmark /> : null,
    };
  }

  menuItems["Custom"] = {
    onClick: () => {
      nav.push("preferences-solana-edit-rpc-connection", {
        onAdd: addCustomRPC,
      });
    },
    detail: <PushDetail />,
  };

  // Add custom RPCs to the menuItems
  customRPCs.forEach((rpc) => {
    menuItems[rpc.name] = {
      onClick: () => changeNetwork(rpc.url),
      detail: currentUrl === rpc.url ? <Checkmark /> : null,
    };
  });

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
    // Add the new custom RPC to local storage and update the state
    const updatedCustomRPCs = [...customRPCs, { name, url }];
    localStorage.setItem("customRPCs", JSON.stringify(updatedCustomRPCs));
    setCustomRPCs(updatedCustomRPCs);
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
