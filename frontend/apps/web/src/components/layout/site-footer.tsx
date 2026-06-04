import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { SocialIcons } from "../ui/social-icons";
import { Logo } from "./logo";

const footerColumns = [
  ["Product", "POS Types", "Features", "Pricing", "Add-ons"],
  ["Company", "About Us", "Contact", "Careers", "Blog"],
  ["Support", "FAQ/Help", "User Guide", "System Status", "Request Support"]
];

export function SiteFooter() {
  return (
    <footer className="border-t border-blue-100 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 py-6 lg:px-8">
        <div className="grid gap-7 md:grid-cols-[1.35fr_2fr_1.25fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
              TJ POS is a modern, cloud-based point-of-sale platform designed for
              businesses in Laos.
            </p>
            <SocialIcons />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {footerColumns.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="font900 text-sm text-slate-950">{title}</h3>
                <div className="mt-3 space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="font700 block text-sm text-slate-600 hover:text-blue-600"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font900 text-sm text-slate-950">Contact Us</h3>
            <div className="font700 mt-3 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-700" /> +856 20 55 888 999
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-700" /> info@tjpos.la
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-700" />
                Unit 45, Saysettha District, Vientiane Capital, Laos
              </p>
            </div>
          </div>
          <div>
            <h3 className="font900 text-sm text-slate-950">Secure & Certified</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {["ISO 27001", "PCI DSS"].map((cert) => (
                <div
                  key={cert}
                  className="rounded-lg border border-blue-100 bg-white p-4"
                >
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <p className="font900 mt-2 text-xs text-slate-900">{cert}</p>
                  <p className="mt-1 text-[10px] text-slate-500">Compliant</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-blue-100 pt-4 text-xs text-slate-500 md:flex-row">
          <p>(c) 2025 TJ POS Co., Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
