import type { QuickAction } from "@/features/pos/types"

type PosActionBarProps = {
  actions: QuickAction[]
  onAction: (actionId: string) => void
  activeActionId?: string | null
  readOnly?: boolean
}

export function PosActionBar({
  actions,
  onAction,
  activeActionId = null,
  readOnly = false,
}: PosActionBarProps) {
  return (
    <div className="grid h-16 shrink-0 gap-3 border-t border-[#ded4c8] bg-[#fbfaf7] px-4 py-3" style={{ gridTemplateColumns: `repeat(${Math.min(actions.length, 5)}, minmax(0, 1fr))` }}>
      {actions.slice(0, 5).map((action) => {
        const Icon = action.icon
        const active = action.id === activeActionId

        return (
          <button
            key={action.id}
            type="button"
            disabled={readOnly}
            onClick={() => onAction(action.id)}
            className={`flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-md border px-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#ded4c8] disabled:hover:bg-white ${
              active
                ? "border-[#2f2419] bg-[#2f2419] text-white"
                : "border-[#ded4c8] bg-white text-[#4f4032] hover:border-[#b88b5c] hover:bg-[#f7f1e9]"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="min-w-0 truncate">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}
