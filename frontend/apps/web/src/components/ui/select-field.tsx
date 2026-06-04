import { ChevronDown } from "lucide-react";

export function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <label>
      <span className="font900 text-sm text-slate-800">{label}</span>
      <button className="font800 mt-2 flex h-12 w-full items-center justify-between rounded-md border border-blue-100 px-4 text-left text-sm text-slate-700">
        {value}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
    </label>
  );
}
