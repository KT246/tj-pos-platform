export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-6 max-w-3xl text-center">
      {eyebrow ? <p className="font900 mb-2 text-sm text-blue-600">{eyebrow}</p> : null}
      <h2 className="text-2xl font-black tracking-normal text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
