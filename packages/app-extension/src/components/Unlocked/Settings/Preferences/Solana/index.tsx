import { useEffect } from "react";

import { useNavigation } from "../../../../common/Layout/NavStack";
import { SettingsList } from "../../../../common/Settings/List";

export const PreferencesSolana: React.FC = () => {
  const nav = useNavigation();
  const solanaMenuItems = {
    "Choose Eclipse Chain": {
      onClick: () => nav.push("preferences-solana-rpc-connection"),
    },
    "Confirmation Commitment": {
      onClick: () => nav.push("preferences-solana-commitment"),
    },
    Explorer: {
      onClick: () => nav.push("preferences-solana-explorer"),
    },
  };

  useEffect(() => {
    nav.setOptions({ headerTitle: "Eclipse" });
  }, [nav]);

  return <SettingsList menuItems={solanaMenuItems} />;
};
