export function Field({
  label,
  placeholder,
  wide = false,
  textarea = false,
  type = "text"
}: {
  label: string;
  placeholder: string;
  wide?: boolean;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="font900 text-sm text-slate-800">{label}</span>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          className="mt-2 h-32 w-full resize-none rounded-md border border-blue-100 px-4 py-3 text-sm transition outline-none placeholder:text-slate-400 focus:border-blue-400"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="mt-2 h-12 w-full rounded-md border border-blue-100 px-4 text-sm transition outline-none placeholder:text-slate-400 focus:border-blue-400"
        />
      )}
    </label>
  );
}
