const socialLinks = [
  {
    label: "Facebook",
    className: "bg-[#1877f2]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-white">
        <path d="M14.1 8.1H16V5h-2.5C10.7 5 9 6.8 9 9.5V11H7v3.2h2V21h3.4v-6.8h2.8l.5-3.2h-3.3V9.8c0-1.1.4-1.7 1.7-1.7Z" />
      </svg>
    )
  },
  {
    label: "Messenger",
    className: "bg-[#00a4ff]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-white">
        <path d="M12 4C7.3 4 3.8 7.2 3.8 11.5c0 2.3 1 4.3 2.7 5.6V20l2.7-1.5c.9.3 1.8.5 2.8.5 4.7 0 8.2-3.2 8.2-7.5S16.7 4 12 4Zm.8 10-2.1-2.2-4.1 2.2 4.5-4.8 2.2 2.2 4-2.2L12.8 14Z" />
      </svg>
    )
  },
  {
    label: "LINE",
    className: "bg-[#06c755]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-white">
        <path d="M20 10.6C20 6.9 16.4 4 12 4S4 6.9 4 10.6c0 3.3 2.9 6 6.8 6.5.3.1.6.2.7.4.1.2.1.4.1.7l-.1 1c0 .3.2.6.6.4.4-.2 2.3-1.3 3.2-2.3 2.8-1 4.7-3.5 4.7-6.7ZM8.2 12.9H6.4V8.6h1v3.4h.8v.9Zm1.6 0h-1V8.6h1v4.3Zm4.2 0h-1l-1.8-2.5v2.5h-1V8.6h1l1.8 2.5V8.6h1v4.3Zm3.2-3.4h-1.7v.7h1.5v.9h-1.5v.8h1.7v1h-2.7V8.6h2.7v.9Z" />
      </svg>
    )
  },
  {
    label: "YouTube",
    className: "bg-[#ff0000]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-white">
        <path d="M21 8.1a3 3 0 0 0-2.1-2.1C17 5.5 12 5.5 12 5.5S7 5.5 5.1 6A3 3 0 0 0 3 8.1C2.5 10 2.5 12 2.5 12s0 2 .5 3.9A3 3 0 0 0 5.1 18c1.9.5 6.9.5 6.9.5s5 0 6.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-3.9.5-3.9s0-2-.5-3.9ZM10 15.1V8.9l5.3 3.1-5.3 3.1Z" />
      </svg>
    )
  }
];

export function SocialIcons() {
  return (
    <div className="mt-4 flex gap-2">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href="#"
          aria-label={social.label}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-white ${social.className}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
