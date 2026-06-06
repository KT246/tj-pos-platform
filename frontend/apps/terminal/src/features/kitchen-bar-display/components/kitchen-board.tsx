import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { KitchenTopbar } from "./kitchen-topbar";
import { NewOrderAlert } from "./new-order-alert";
import { SettingsDrawer } from "./settings-drawer";
import { StatusAndFilters } from "./status-and-filters";
import { TicketDetailModal } from "./ticket-detail-modal";
import { TicketGrid } from "./ticket-grid";
import { useKitchenDisplayStore } from "../stores/kitchen-display-store";
import type { KitchenBoardMode, KitchenTicket } from "../types";
import {
  findTicketByRouteId,
  getKitchenStatusCounts,
  getTicketRouteId,
  getVisibleKitchenTickets
} from "../utils";

type KitchenBoardProps = {
  mode: KitchenBoardMode;
  businessSlug: string;
  ticketRouteId?: string;
};

function getDetailBasePath(businessSlug: string, mode: KitchenBoardMode) {
  return `/terminal/b/${businessSlug}/${mode}`;
}

export function KitchenBoard({
  mode,
  businessSlug,
  ticketRouteId
}: KitchenBoardProps) {
  const navigate = useNavigate();
  const activeStatus = useKitchenDisplayStore((state) => state.activeStatus);
  const selectedStation = useKitchenDisplayStore((state) => state.selectedStation);
  const sortMode = useKitchenDisplayStore((state) => state.sortMode);
  const soundEnabled = useKitchenDisplayStore((state) => state.soundEnabled);
  const settingsOpen = useKitchenDisplayStore((state) => state.settingsOpen);
  const alertOpen = useKitchenDisplayStore((state) => state.alertOpen);
  const alertTicketId = useKitchenDisplayStore((state) => state.alertTicketId);
  const tickets = useKitchenDisplayStore((state) => state.tickets);
  const settings = useKitchenDisplayStore((state) => state.settings);
  const setActiveStatus = useKitchenDisplayStore((state) => state.setActiveStatus);
  const setSelectedStation = useKitchenDisplayStore(
    (state) => state.setSelectedStation
  );
  const setSortMode = useKitchenDisplayStore((state) => state.setSortMode);
  const setSoundEnabled = useKitchenDisplayStore(
    (state) => state.setSoundEnabled
  );
  const setSettingsOpen = useKitchenDisplayStore(
    (state) => state.setSettingsOpen
  );
  const setAlertOpen = useKitchenDisplayStore((state) => state.setAlertOpen);
  const updateSettings = useKitchenDisplayStore((state) => state.updateSettings);
  const resetSettings = useKitchenDisplayStore((state) => state.resetSettings);
  const toggleStationEnabled = useKitchenDisplayStore(
    (state) => state.toggleStationEnabled
  );
  const startPreparing = useKitchenDisplayStore(
    (state) => state.startPreparing
  );
  const markReady = useKitchenDisplayStore((state) => state.markReady);
  const completePickup = useKitchenDisplayStore(
    (state) => state.completePickup
  );
  const recallTicket = useKitchenDisplayStore((state) => state.recallTicket);
  const dismissAlert = useKitchenDisplayStore((state) => state.dismissAlert);
  const showNotice = useKitchenDisplayStore((state) => state.showNotice);

  const visibleTickets = useMemo(
    () =>
      getVisibleKitchenTickets({
        tickets,
        activeStatus,
        selectedStation,
        sortMode,
        settings
      }),
    [activeStatus, selectedStation, settings, sortMode, tickets]
  );

  const counts = useMemo(() => getKitchenStatusCounts(tickets), [tickets]);
  const routeTicket = findTicketByRouteId(tickets, ticketRouteId);
  const alertTicket =
    tickets.find((ticket) => ticket.id === alertTicketId && ticket.status === "new") ??
    null;

  function openTicketDetail(ticketId: string) {
    navigate(
      `/terminal/b/${businessSlug}/kitchen/ticket/${getTicketRouteId(ticketId)}`
    );
  }

  function closeTicketDetail() {
    navigate(getDetailBasePath(businessSlug, mode));
  }

  function handleCompletePickup(ticketId: string) {
    completePickup(ticketId);
    if (routeTicket?.id === ticketId) {
      closeTicketDetail();
    }
  }

  function handleOpenAlert() {
    if (!alertTicket) {
      showNotice("No new order alert is waiting.");
      return;
    }

    setAlertOpen(true);
  }

  function handleSaveSettings() {
    setSettingsOpen(false);
    showNotice("Kitchen display settings saved.");
  }

  function handleRefresh() {
    showNotice("Kitchen board refreshed.");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f7faff] text-[#0b1736]">
      <KitchenTopbar
        mode={mode}
        soundEnabled={soundEnabled}
        alertCount={alertTicket ? 1 : 0}
        autoRefreshSeconds={settings.autoRefreshSeconds}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenAlert={handleOpenAlert}
        onOpenSettings={() => setSettingsOpen(true)}
        onRefresh={handleRefresh}
      />

      <main className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-5 overflow-hidden p-6">
        <StatusAndFilters
          activeStatus={activeStatus}
          selectedStation={selectedStation}
          sortMode={sortMode}
          counts={counts}
          onStatusChange={setActiveStatus}
          onStationChange={setSelectedStation}
          onSortChange={setSortMode}
        />

        <section className="min-h-0 overflow-auto pr-1">
          <TicketGrid
            tickets={visibleTickets}
            showItemNotes={settings.showItemNotes}
            showElapsedTime={settings.showElapsedTime}
            density={settings.density}
            onStartPreparing={startPreparing}
            onMarkReady={markReady}
            onCompletePickup={handleCompletePickup}
            onRecall={recallTicket}
            onViewDetail={openTicketDetail}
          />
        </section>
      </main>

      {routeTicket ? (
        <TicketDetailModal
          ticket={routeTicket}
          onClose={closeTicketDetail}
          onStartPreparing={startPreparing}
          onMarkReady={markReady}
          onCompletePickup={handleCompletePickup}
          onPrint={(ticketId) => showNotice(`${ticketId} sent to station printer.`)}
        />
      ) : null}

      {alertOpen && alertTicket ? (
        <NewOrderAlert
          ticket={alertTicket}
          soundEnabled={soundEnabled}
          onViewTicket={(ticketId) => {
            dismissAlert();
            openTicketDetail(ticketId);
          }}
          onStartPreparing={startPreparing}
          onMute={() => setSoundEnabled(false)}
          onDismiss={dismissAlert}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsDrawer
          settings={settings}
          soundEnabled={soundEnabled}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSaveSettings}
          onReset={() => {
            resetSettings();
            showNotice("Kitchen display settings reset.");
          }}
          onToggleSound={setSoundEnabled}
          onUpdateSettings={updateSettings}
          onToggleStation={toggleStationEnabled}
        />
      ) : null}
    </div>
  );
}
