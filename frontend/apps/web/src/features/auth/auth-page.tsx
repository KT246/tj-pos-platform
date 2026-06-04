import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Logo } from "../../components/layout/logo";
import { Badge } from "../../components/ui/badge";
import { PrimaryButton } from "../../components/ui/buttons";
import { Field } from "../../components/ui/field";
import { TrustPills } from "../web-main/components/trust-pills";

export function AuthPage({ mode }: { mode: "login" | "forgot" | "reset" }) {
  const copy = {
    login: {
      title: "Login to TJ POS",
      description:
        "Access Platform Admin and Business Admin from one secure entry point.",
      primary: "Login",
      link: { href: "/forgot-password", label: "Forgot password?" }
    },
    forgot: {
      title: "Reset Your Password",
      description: "Enter your admin email and we will send reset instructions.",
      primary: "Send Reset Link",
      link: { href: "/login", label: "Back to login" }
    },
    reset: {
      title: "Create New Password",
      description: "Set a new secure password for your TJ POS admin account.",
      primary: "Update Password",
      link: { href: "/login", label: "Back to login" }
    }
  }[mode];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] text-slate-950">
      <header className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-10">
        <Logo />
        <Link href="/" className="font900 text-sm text-blue-600">
          Back to website
        </Link>
      </header>
      <main className="mx-auto grid max-w-[1180px] gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="flex flex-col justify-center">
          <Badge Icon={ShieldCheck}>Secure Admin Access</Badge>
          <h1 className="mt-6 text-5xl leading-tight font-black text-slate-950">
            Smart POS for <span className="text-blue-600">Every Business</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Manage your platform, businesses, branches and POS operations with a clean,
            reliable admin experience.
          </p>
          <TrustPills />
        </section>
        <section className="rounded-lg border border-blue-100 bg-white p-8 shadow-[0_20px_70px_rgba(37,99,235,0.10)]">
          <h2 className="text-3xl font-black text-slate-950">{copy.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy.description}</p>
          <div className="mt-8 space-y-5">
            <Field label="Email Address" placeholder="admin@business.la" />
            {mode !== "forgot" ? (
              <Field
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
            ) : null}
            {mode === "reset" ? (
              <Field
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
              />
            ) : null}
          </div>
          <div className="mt-7">
            <PrimaryButton href="#">{copy.primary}</PrimaryButton>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-blue-100 pt-5">
            <Link href={copy.link.href} className="font900 text-sm text-blue-600">
              {copy.link.label}
            </Link>
            <Link href="/request-demo" className="font900 text-sm text-slate-500">
              Request Demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
