import { Check, RotateCcw, Save, Settings, X } from "lucide-react";

import { kitchenStations } from "../data/kitchen-display-data";
import type { KitchenSettings, KitchenStationId } from "../types";

type SettingsDrawerProps = {
  settings: KitchenSettings;
  soundEnabled: boolean;
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
  onToggleSound: (enabled: boolean) => void;
  onUpdateSettings: (patch: Partial<KitchenSettings>) => void;
  onToggleStation: (station: Exclude<KitchenStationId, "all">) => void;
};

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-blue-100 bg-white px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50/50">
      <span>
        <span className="block text-[14px] font-black text-[#0b1736]">
          {title}
        </span>
        <span className="mt-1 block text-[12px] font-semibold text-slate-500">
          {subtitle}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="h-5 w-5 accent-blue-600"
      />
    </label>
  );
}

export function SettingsDrawer({
  settings,
  soundEnabled,
  onClose,
  onSave,
  onReset,
  onToggleSound,
  onUpdateSettings,
  onToggleStation
}: SettingsDrawerProps) {
  return (
    <div className="fixed inset-0 z-40 bg-[#071633]/35">
      <aside className="ml-auto flex h-full w-[430px] max-w-[calc(100vw-24px)] flex-col bg-white shadow-[0_28px_90px_rgba(7,22,51,0.28)]">
        <header className="flex items-center justify-between border-b border-blue-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Settings className="h-6 w-6" strokeWidth={2.35} />
            </div>
            <div>
              <h2 className="text-[22px] font-black leading-none text-[#0b1736]">
                Kitchen Settings
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                Station filter and display behavior
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-white text-[#0b1736] transition hover:border-blue-300 hover:bg-blue-50"
            aria-label="Close kitchen settings"
          >
            <X className="h-5 w-5" strokeWidth={2.35} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-auto bg-[#f7faff] p-5">
          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-black uppercase tracking-wide text-[#0b1736]">
              Station Filter
            </h3>
            <div className="mt-4 space-y-3">
              {kitchenStations
                .filter((station) => station.id !== "all")
                .map(({ id, label, icon: Icon }) => {
                  const stationId = id as Exclude<KitchenStationId, "all">;
                  const checked = settings.enabledStationIds.includes(stationId);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onToggleStation(stationId)}
                      className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left transition ${
                        checked
                          ? "border-blue-300 bg-blue-50 text-blue-600"
                          : "border-blue-100 bg-white text-[#0b1736] hover:border-blue-300"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-[14px] font-black">
                        <Icon className="h-5 w-5" strokeWidth={2.3} />
                        {label}
                      </span>
                      {checked ? <Check className="h-5 w-5" strokeWidth={2.4} /> : null}
                    </button>
                  );
                })}
            </div>
          </section>

          <section className="space-y-3">
            <ToggleRow
              title="Sound Alerts"
              subtitle="Play sound for every new order"
              checked={soundEnabled}
              onChange={onToggleSound}
            />
            <ToggleRow
              title="Show Item Notes"
              subtitle="Display modifiers and preparation notes"
              checked={settings.showItemNotes}
              onChange={(checked) => onUpdateSettings({ showItemNotes: checked })}
            />
            <ToggleRow
              title="Show Elapsed Time"
              subtitle="Highlight waiting time on tickets"
              checked={settings.showElapsedTime}
              onChange={(checked) => onUpdateSettings({ showElapsedTime: checked })}
            />
          </section>

          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h3 className="text-[15px] font-black uppercase tracking-wide text-[#0b1736]">
              Auto Refresh
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[5, 10, 15].map((seconds) => (
                <button
                  key={seconds}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      autoRefreshSeconds: seconds as KitchenSettings["autoRefreshSeconds"]
                    })
                  }
                  className={`h-11 rounded-xl border text-[14px] font-black transition ${
                    settings.autoRefreshSeconds === seconds
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-100 bg-white text-[#0b1736] hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {seconds}s
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <ToggleRow
              title="Compact Ticket Cards"
              subtitle="Show denser cards for busy service"
              checked={settings.density === "compact"}
              onChange={(checked) =>
                onUpdateSettings({ density: checked ? "compact" : "comfortable" })
              }
            />
            <ToggleRow
              title="Auto Print Tickets"
              subtitle="Send tickets to station printer automatically"
              checked={settings.autoPrintTickets}
              onChange={(checked) =>
                onUpdateSettings({ autoPrintTickets: checked })
              }
            />
            <ToggleRow
              title="Large Print Text"
              subtitle="Use larger text on printed kitchen tickets"
              checked={settings.largePrintText}
              onChange={(checked) => onUpdateSettings({ largePrintText: checked })}
            />
          </section>
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-blue-100 bg-white p-5">
          <button
            type="button"
            onClick={onReset}
            className="flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white text-[14px] font-black text-[#0b1736] transition hover:border-blue-300 hover:bg-blue-50"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2.35} />
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[14px] font-black text-white transition hover:bg-blue-700"
          >
            <Save className="h-5 w-5" strokeWidth={2.35} />
            Save Settings
          </button>
        </footer>
      </aside>
    </div>
  );
}
