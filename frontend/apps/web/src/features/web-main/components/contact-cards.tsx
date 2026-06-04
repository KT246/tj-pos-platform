"use client";

import { Building2, Check, Headphones, Mail, Phone, User } from "lucide-react";

import { IconBox } from "../../../components/ui/icon-box";
import { useI18n } from "../../../lib/i18n";

const contactCards = [
  [
    "Sales Inquiries",
    "Talk to our sales team about pricing and plans.",
    "sales@tjpos.la",
    User,
    "blue"
  ],
  [
    "Customer Support",
    "Get help with setup, billing or technical issues.",
    "support@tjpos.la",
    Headphones,
    "green"
  ],
  [
    "Call Us",
    "Speak with our team during business hours.",
    "+856 20 55 888 999",
    Phone,
    "orange"
  ],
  [
    "Email Us",
    "Send us an email anytime and we will respond.",
    "info@tjpos.la",
    Mail,
    "purple"
  ],
  [
    "Visit Our Office",
    "Meet us at our office in Vientiane, Laos.",
    "View on Map",
    Building2,
    "blue"
  ]
] as const;

export function ContactCards() {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {contactCards.map(([title, body, value, Icon, tone]) => (
        <div
          key={title}
          className="rounded-lg border border-blue-100 bg-white p-6 text-center shadow-sm"
        >
          <div className="mx-auto w-fit">
            <IconBox Icon={Icon} tone={tone} />
          </div>
          <h3 className="mt-4 text-base font-black text-slate-950">{t(title)}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t(body)}</p>
          <p className="font900 mt-4 text-sm text-blue-600">{t(value)}</p>
          <p className="font800 mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            {t("Response within 2 hours")}
          </p>
        </div>
      ))}
    </div>
  );
}
