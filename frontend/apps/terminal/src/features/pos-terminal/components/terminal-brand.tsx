export function TerminalBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center">
      <img
        src="/terminal-logo.png"
        alt="TJ POS"
        className={`${compact ? "h-[34px]" : "h-[38px]"} w-auto object-contain`}
      />
    </div>
  );
}
