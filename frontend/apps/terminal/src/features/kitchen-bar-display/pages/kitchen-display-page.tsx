import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { KitchenBoard } from "../components/kitchen-board";
import { useKitchenDisplayStore } from "../stores/kitchen-display-store";
import type { KitchenBoardMode } from "../types";

type KitchenDisplayPageProps = {
  mode: KitchenBoardMode;
};

export function KitchenDisplayPage({ mode }: KitchenDisplayPageProps) {
  const { businessSlug = "tj-cafe-vientiane", ticketId } = useParams();
  const setBoardMode = useKitchenDisplayStore((state) => state.setBoardMode);

  useEffect(() => {
    setBoardMode(mode);
  }, [mode, setBoardMode]);

  return (
    <KitchenBoard
      mode={mode}
      businessSlug={businessSlug}
      ticketRouteId={ticketId}
    />
  );
}
