"use client"

import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Coffee,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Printer,
  Save,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

const steps = [
  { number: 1, label: "ປະເພດ POS", description: "ເລືອກຮູບແບບ POS" },
  { number: 2, label: "ຂໍ້ມູນລູກຄ້າ", description: "ຂໍ້ມູນຮ້ານ ແລະ ເຈົ້າຂອງ" },
  { number: 3, label: "ການບໍລິການ", description: "ແພັກເກດ ແລະ ໄລຍະໃຊ້" },
  { number: 4, label: "ບັນຊີເຂົ້າໃຊ້ POS", description: "ສ້າງບັນຊີ ແລະ ລະຫັດຜ່ານ" },
] as const

const fieldLabels: Record<string, string> = {
  posType: "ປະເພດ POS",
  businessName: "ຊື່ຮ້ານ",
  ownerName: "ຊື່ເຈົ້າຂອງ",
  phone: "ເບີໂທ",
  email: "ອີເມວ",
  slug: "ລະຫັດຮ້ານ",
  username: "ຊື່ຜູ້ໃຊ້",
  password: "ລະຫັດຜ່ານ",
  confirmPassword: "ຢືນຢັນລະຫັດຜ່ານ",
  plan: "ແພັກເກດ",
  startDate: "ວັນທີເລີ່ມໃຊ້",
  duration: "ໄລຍະບໍລິການ",
}

type ProvisionResult = {
  business: { id: string; name: string; slug: string; type: string; status: "active" }
  owner: { id: string; name: string; username: string; email: string }
  subscription: { id: string; plan: string; startsOn: string; endsOn: string; status: "active" }
}

export default function CreatePosClientPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [businessName, setBusinessName] = useState("")
  const [slug, setSlug] = useState("")
  const [username, setUsername] = useState("")
  const [posType, setPosType] = useState("cafe")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showSlugHelp, setShowSlugHelp] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [provisionResult, setProvisionResult] = useState<ProvisionResult | null>(null)

  const printProvisionCredentials = () => {
    if (!provisionResult) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const values = {
      businessName: escapeHtml(provisionResult.business.name),
      slug: escapeHtml(provisionResult.business.slug),
      username: escapeHtml(provisionResult.owner.username),
      password: escapeHtml(password),
      plan: escapeHtml(provisionResult.subscription.plan),
      endsOn: escapeHtml(provisionResult.subscription.endsOn),
      printedOn: escapeHtml(new Date().toLocaleDateString("lo-LA")),
    }

    printWindow.document.write(`<!doctype html>
      <html lang="lo">
        <head>
          <meta charset="utf-8" />
          <title>ຂໍ້ມູນເຂົ້າໃຊ້ TJ POS</title>
          <style>
            @page { size: A4; margin: 18mm; }
            * { box-sizing: border-box; }
            body { color: #182230; font-family: "Noto Sans Lao", "Segoe UI", sans-serif; font-size: 14px; margin: 0; }
            .sheet { border: 1px solid #d0d5dd; border-radius: 14px; overflow: hidden; }
            .heading { background: #f0fdf4; border-bottom: 1px solid #bbf7d0; padding: 28px 30px 22px; text-align: center; }
            .mark { align-items: center; background: #dcfae6; border-radius: 50%; color: #039855; display: inline-flex; font-size: 26px; font-weight: 800; height: 46px; justify-content: center; width: 46px; }
            h1 { font-size: 23px; margin: 13px 0 5px; }
            .subtitle { color: #475467; margin: 0; }
            .content { padding: 26px 30px; }
            .business { color: #344054; font-size: 16px; font-weight: 800; margin: 0 0 20px; text-align: center; }
            .grid { border-left: 1px solid #eaecf0; border-top: 1px solid #eaecf0; display: grid; grid-template-columns: 1fr 1fr; }
            .item { border-bottom: 1px solid #eaecf0; border-right: 1px solid #eaecf0; padding: 15px 16px; }
            .label { color: #667085; display: block; font-size: 11px; font-weight: 700; margin-bottom: 6px; }
            .value { color: #182230; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 14px; font-weight: 700; overflow-wrap: anywhere; }
            .notice { background: #fffaeb; border: 1px solid #fedf89; border-radius: 8px; color: #93370d; line-height: 1.7; margin-top: 22px; padding: 12px 14px; }
            .footer { border-top: 1px solid #eaecf0; color: #667085; font-size: 11px; padding: 14px 30px; text-align: center; }
            @media print { .sheet { border-color: #d0d5dd; } }
          </style>
        </head>
        <body>
          <main class="sheet">
            <header class="heading"><span class="mark">✓</span><h1>ຂໍ້ມູນເຂົ້າໃຊ້ TJ POS</h1><p class="subtitle">ສຳລັບສົ່ງໃຫ້ເຈົ້າຂອງຮ້ານ</p></header>
            <section class="content">
              <p class="business">${values.businessName}</p>
              <div class="grid">
                <div class="item"><span class="label">ລະຫັດຮ້ານ</span><span class="value">${values.slug}</span></div>
                <div class="item"><span class="label">ຊື່ຜູ້ໃຊ້</span><span class="value">${values.username}</span></div>
                <div class="item"><span class="label">ລະຫັດຜ່ານ</span><span class="value">${values.password}</span></div>
                <div class="item"><span class="label">ແພັກເກດ / ວັນໝົດອາຍຸ</span><span class="value">${values.plan} · ${values.endsOn}</span></div>
              </div>
              <p class="notice">ກະລຸນາເກັບຮັກສາລະຫັດຜ່ານນີ້ໃຫ້ປອດໄພ ແລະ ສົ່ງໃຫ້ເຈົ້າຂອງຮ້ານຜ່ານຊ່ອງທາງທີ່ເໝາະສົມ.</p>
            </section>
            <footer class="footer">ວັນທີພິມ: ${values.printedOn}</footer>
          </main>
        </body>
      </html>`)
    printWindow.document.close()
    printWindow.focus()
    window.setTimeout(() => printWindow.print(), 250)
  }

  useEffect(() => {
    if (!showSlugHelp) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSlugHelp(false)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [showSlugHelp])

  function generateSlug() {
    setSlug(slugifyBusinessName(businessName, posType))
    clearFieldError("slug")
  }

  function generatePassword() {
    const nextPassword = createSecurePassword()
    setPassword(nextPassword)
    setConfirmPassword(nextPassword)
    setShowPassword(true)
    clearFieldError("password")
    clearFieldError("confirmPassword")
    const confirmField = formRef.current?.elements.namedItem("confirmPassword")
    if (confirmField instanceof HTMLInputElement) confirmField.setCustomValidity("")
  }

  function generateUsername() {
    setUsername(createUsername(businessName, slug, posType))
    clearFieldError("username")
  }

  function clearFieldError(name: string) {
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function handleFieldInput(event: FormEvent<HTMLFormElement>) {
    const field = event.target as HTMLInputElement | HTMLSelectElement
    if (field.name) clearFieldError(field.name)
    if (submitError) setSubmitError("")
  }

  function validateCurrentStep() {
    const panel = formRef.current?.querySelector<HTMLElement>(`[data-step="${currentStep}"]`)
    const fields = panel?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select") ?? []
    const confirmPasswordField = formRef.current?.elements.namedItem("confirmPassword")

    if (confirmPasswordField instanceof HTMLInputElement) {
      confirmPasswordField.setCustomValidity(
        password && confirmPassword && confirmPassword !== password ? "Passwords do not match" : "",
      )
    }

    const nextErrors = { ...errors }
    let firstInvalidField: HTMLInputElement | HTMLSelectElement | null = null

    for (const field of fields) {
      delete nextErrors[field.name]
      const isBlankRequiredInput = field instanceof HTMLInputElement && field.required && !field.value.trim()
      if (isBlankRequiredInput || !field.checkValidity()) {
        nextErrors[field.name] = getFieldError(field)
        firstInvalidField ??= field
      }
    }

    setErrors(nextErrors)
    firstInvalidField?.focus()
    return firstInvalidField === null
  }

  function goNext() {
    if (!validateCurrentStep()) return
    setCurrentStep((step) => Math.min(step + 1, 4))
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  async function createPosClient() {
    if (!validateCurrentStep() || !formRef.current) return

    const formData = new FormData(formRef.current)
    setSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/platform/pos-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.get("businessName"),
          ownerName: formData.get("ownerName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          slug: formData.get("slug"),
          posType: formData.get("posType"),
          username: formData.get("username"),
          password: formData.get("password"),
          plan: formData.get("plan"),
          startDate: formData.get("startDate"),
          durationMonths: Number(formData.get("duration")),
        }),
      })
      const data = await response.json() as ProvisionResult | { message?: string | string[] }

      if (response.status === 401 || response.status === 403) {
        window.location.assign("/login")
        return
      }

      if (!response.ok) {
        const rawMessage = "message" in data ? data.message : "Unable to create POS"
        const message = Array.isArray(rawMessage) ? rawMessage.join(", ") : rawMessage ?? "Unable to create POS"
        const normalizedMessage = message.toLowerCase()

        if (normalizedMessage.includes("slug")) {
          setErrors((current) => ({ ...current, slug: "Business slug ນີ້ຖືກໃຊ້ແລ້ວ" }))
          setCurrentStep(2)
        } else if (normalizedMessage.includes("username") || normalizedMessage.includes("email")) {
          setErrors((current) => ({ ...current, username: "Username ຫຼື Email ນີ້ຖືກໃຊ້ແລ້ວ" }))
          setCurrentStep(4)
        } else {
          setSubmitError(message)
        }
        return
      }

      setProvisionResult(data as ProvisionResult)
    } catch {
      setSubmitError("ບໍ່ສາມາດເຊື່ອມຕໍ່ Backend ໄດ້. ກະລຸນາລອງໃໝ່.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading page-heading--form">
        <div>
          <Link className="back-link" href="/platform-admin/pos-clients">
            <ArrowLeft size={16} /> ກັບໄປລາຍການ POS
          </Link>
          <p className="eyebrow">POS PROVISIONING</p>
          <h1>ສ້າງ ແລະ ມອບ POS ໃໝ່</h1>
          <p>ດຳເນີນການ 3 ຂັ້ນຕອນເພື່ອກຽມບໍລິການ POS ໃຫ້ລູກຄ້າ</p>
        </div>
      </section>

      <nav className="wizard-stepper" aria-label="ຂັ້ນຕອນສ້າງ POS">
        {steps.map((step, index) => {
          const completed = currentStep > step.number
          const active = currentStep === step.number
          return (
            <div className={`wizard-step ${active ? "wizard-step--active" : ""} ${completed ? "wizard-step--complete" : ""}`} key={step.number}>
              <span className="wizard-step__number">{completed ? <Check size={17} /> : step.number}</span>
              <span className="wizard-step__copy"><strong>{step.label}</strong><small>{step.description}</small></span>
              {index < steps.length - 1 && <span className="wizard-step__line" />}
            </div>
          )
        })}
      </nav>

      <form className="wizard-form" ref={formRef} noValidate onInput={handleFieldInput} onSubmit={(event) => event.preventDefault()}>
        <section className="wizard-panel" data-step="1" hidden={currentStep !== 1}>
          <div className="form-card__heading">
            <span><Coffee size={19} /></span>
            <div><h2>ປະເພດ POS</h2><p>ເລືອກຮູບແບບ POS ທີ່ຈະມອບໃຫ້ລູກຄ້າ</p></div>
          </div>
          <label className="field field--full">
            <span>ເລືອກປະເພດ POS <b>*</b></span>
            <span className="select-wrap">
              <Coffee size={18} />
              <select name="posType" value={posType} onChange={(event) => setPosType(event.target.value)} required aria-invalid={Boolean(errors.posType)}>
                <option value="cafe">Cafe POS — ຮ້ານກາເຟ ແລະ ເຄື່ອງດື່ມ</option>
              </select>
              <ChevronDown size={17} />
            </span>
            <FieldError name="posType" errors={errors} />
            <small>ປັດຈຸບັນ TJ POS ຮອງຮັບ Cafe POS. ປະເພດອື່ນຈະເພີ່ມໃນພາຍຫຼັງ.</small>
          </label>
        </section>

        <section className="wizard-panel" data-step="2" hidden={currentStep !== 2}>
          <div className="form-card__heading">
            <span><Building2 size={19} /></span>
            <div><h2>ຂໍ້ມູນລູກຄ້າ</h2><p>ຂໍ້ມູນພື້ນຖານຂອງຮ້ານທີ່ຈະໃຊ້ POS</p></div>
          </div>
          <div className="form-grid">
            <label className="field field--full">
              <span>ຊື່ຮ້ານ <b>*</b></span>
              <input name="businessName" placeholder="ຕົວຢ່າງ: TJ Café Vientiane" required value={businessName} onChange={(event) => setBusinessName(event.target.value)} aria-invalid={Boolean(errors.businessName)} />
              <FieldError name="businessName" errors={errors} />
            </label>
            <label className="field">
              <span>ຊື່ເຈົ້າຂອງ <b>*</b></span>
              <input name="ownerName" placeholder="ຊື່ ແລະ ນາມສະກຸນ" required aria-invalid={Boolean(errors.ownerName)} />
              <FieldError name="ownerName" errors={errors} />
            </label>
            <label className="field">
              <span>ເບີໂທ <b>*</b></span>
              <input name="phone" placeholder="020 5xxx xxxx" inputMode="tel" required aria-invalid={Boolean(errors.phone)} />
              <FieldError name="phone" errors={errors} />
            </label>
            <label className="field">
              <span>ອີເມວ</span>
              <input name="email" placeholder="owner@example.com" type="email" aria-invalid={Boolean(errors.email)} />
              <FieldError name="email" errors={errors} />
            </label>
            <label className="field">
              <span className="field-label-with-help">
                  <span>ລະຫັດຮ້ານ (Business slug) <b>*</b></span>
                <button
                  type="button"
                  className="field-help-button"
                  aria-label="Giải thích Business slug"
                  aria-expanded={showSlugHelp}
                  aria-controls="business-slug-help"
                  onClick={(event) => {
                    event.preventDefault()
                    setShowSlugHelp(true)
                  }}
                >
                  <HelpCircle size={15} />
                </button>
              </span>
              <span className="field-control-with-action">
                <input
                  name="slug"
                  placeholder="cafe-tj-cafe-vientiane"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  aria-invalid={Boolean(errors.slug)}
                />
                <button type="button" onClick={generateSlug} disabled={!businessName.trim()}><Sparkles size={14} /> Generate</button>
              </span>
              <FieldError name="slug" errors={errors} />
            </label>
          </div>
        </section>

        <section className="wizard-panel" data-step="3" hidden={currentStep !== 3}>
          <div className="form-card__heading">
            <span><ShieldCheck size={19} /></span>
            <div><h2>ການບໍລິການ</h2><p>ກຳນົດແພັກເກດ ແລະ ໄລຍະໃຊ້ງານ</p></div>
          </div>
          <div className="form-grid">
            <label className="field field--full">
              <span>ແພັກເກດ <b>*</b></span>
              <span className="select-wrap select-wrap--plain">
                <select name="plan" defaultValue="starter" required aria-invalid={Boolean(errors.plan)}>
                  <option value="starter">Starter</option>
                  <option value="business">Business</option>
                  <option value="premium">Premium</option>
                </select>
                <ChevronDown size={17} />
              </span>
              <FieldError name="plan" errors={errors} />
            </label>
            <label className="field">
              <span>ວັນທີເລີ່ມໃຊ້ <b>*</b></span>
              <input name="startDate" type="date" required aria-invalid={Boolean(errors.startDate)} />
              <FieldError name="startDate" errors={errors} />
            </label>
            <label className="field">
              <span>ໄລຍະບໍລິການ <b>*</b></span>
              <span className="select-wrap select-wrap--plain">
                <select name="duration" defaultValue="12" required aria-invalid={Boolean(errors.duration)}>
                  <option value="1">1 ເດືອນ</option>
                  <option value="6">6 ເດືອນ</option>
                  <option value="12">12 ເດືອນ</option>
                </select>
                <ChevronDown size={17} />
              </span>
              <FieldError name="duration" errors={errors} />
            </label>
          </div>
        </section>

        <section className="wizard-panel" data-step="4" hidden={currentStep !== 4}>
          <div className="form-card__heading">
            <span><KeyRound size={19} /></span>
            <div><h2>ບັນຊີເຂົ້າໃຊ້ POS</h2><p>ສ້າງບັນຊີເລີ່ມຕົ້ນສຳລັບເຈົ້າຂອງຮ້ານ</p></div>
          </div>
          <div className="form-grid form-grid--account">
            <label className="field">
              <span className="field-label-with-help">
                <span>ຊື່ຜູ້ໃຊ້ <b>*</b></span>
                <button type="button" className="field-generate-button" onClick={generateUsername} disabled={!businessName.trim() && !slug.trim()}><Sparkles size={13} /> ສ້າງອັດຕະໂນມັດ</button>
              </span>
              <input
                name="username"
                placeholder="ຕົວຢ່າງ: owner.tjcafe"
                autoComplete="username"
                pattern="[A-Za-z0-9._-]+"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-invalid={Boolean(errors.username)}
              />
              <FieldError name="username" errors={errors} />
              <small>ໃຊ້ສະເພາະ a-z, A-Z, 0-9, ຈຸດ, _ ແລະ -</small>
            </label>
            <label className="field">
              <span className="field-label-with-help">
                <span>ລະຫັດຜ່ານ <b>*</b></span>
                <button type="button" className="field-generate-button" onClick={generatePassword}><Sparkles size={13} /> ສ້າງອັດຕະໂນມັດ</button>
              </span>
              <span className="password-control">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="ຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    clearFieldError("confirmPassword")
                    const confirmField = formRef.current?.elements.namedItem("confirmPassword")
                    if (confirmField instanceof HTMLInputElement) confirmField.setCustomValidity("")
                  }}
                  aria-invalid={Boolean(errors.password)}
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              <FieldError name="password" errors={errors} />
            </label>
            <label className="field">
              <span>ຢືນຢັນລະຫັດຜ່ານ <b>*</b></span>
              <span className="password-control">
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="ປ້ອນ Password ອີກຄັ້ງ"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    event.target.setCustomValidity("")
                  }}
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
              </span>
              <FieldError name="confirmPassword" errors={errors} />
            </label>
          </div>
        </section>

        <div className="wizard-actions">
          <div>
            {currentStep === 1 ? (
              <Link className="secondary-button" href="/platform-admin/pos-clients">ຍົກເລີກ</Link>
            ) : (
              <button className="secondary-button" type="button" onClick={goBack}><ArrowLeft size={17} /> ກັບຄືນ</button>
            )}
          </div>
          <span className="wizard-progress">ຂັ້ນຕອນ {currentStep} / 4</span>
          {currentStep < 4 ? (
            <button className="primary-button" type="button" onClick={goNext}>ຕໍ່ໄປ <ArrowRight size={17} /></button>
          ) : (
            <button className="primary-button" type="button" disabled={submitting} onClick={() => void createPosClient()}><Save size={17} /> {submitting ? "ກຳລັງສ້າງ..." : "ສ້າງ POS"}</button>
          )}
        </div>
        {submitError && <p className="form-submit-error" role="alert"><CircleAlert size={14} /> {submitError}</p>}
      </form>

      {showSlugHelp && (
        <div className="help-modal-backdrop" onMouseDown={() => setShowSlugHelp(false)}>
          <section className="help-modal" id="business-slug-help" role="dialog" aria-modal="true" aria-labelledby="business-slug-help-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="help-modal__header">
              <span className="help-modal__icon"><HelpCircle size={22} /></span>
              <div><p>FIELD GUIDE</p><h2 id="business-slug-help-title">Business slug ແມ່ນຫຍັງ?</h2></div>
              <button type="button" onClick={() => setShowSlugHelp(false)} aria-label="Đóng giải thích"><X size={18} /></button>
            </div>
            <div className="help-modal__body">
              <p>ເປັນລະຫັດສັ້ນສຳລັບລະບຸ POS ຂອງລູກຄ້າໃນ URL ແລະ ລະບົບ. ໃຊ້ສະເພາະ <strong>a-z</strong>, <strong>0-9</strong> ແລະ ເຄື່ອງໝາຍ <strong>-</strong> ເທົ່ານັ້ນ.</p>
              <div className="help-modal__example"><span>ຕົວຢ່າງ URL ຈິງ</span><code>http://pos.js.com/cafe-tj-cafe-vientiane</code></div>
              <p>Slug ຄວນບໍ່ຊ້ຳກັບຮ້ານອື່ນ ແລະ ບໍ່ຄວນປ່ຽນຫຼັງເປີດໃຊ້.</p>
            </div>
            <div className="help-modal__footer"><button type="button" className="primary-button" onClick={() => setShowSlugHelp(false)}>ເຂົ້າໃຈແລ້ວ</button></div>
          </section>
        </div>
      )}

      {provisionResult && (
        <div className="help-modal-backdrop">
          <section className="help-modal provision-success-modal" role="dialog" aria-modal="true" aria-labelledby="provision-success-title">
            <div className="provision-success-heading">
              <span><CircleCheck size={30} /></span>
              <h2 id="provision-success-title">ສ້າງ POS ສຳເລັດ</h2>
              <p>ລູກຄ້າສາມາດໃຊ້ບັນຊີນີ້ເຂົ້າ POS ໄດ້ທັນທີ</p>
            </div>
            <div className="provision-credentials">
              <div><span>ລະຫັດຮ້ານ</span><code>{provisionResult.business.slug}</code></div>
              <div><span>ຊື່ຜູ້ໃຊ້</span><code>{provisionResult.owner.username}</code></div>
              <div><span>ລະຫັດຜ່ານ</span><code>{password}</code></div>
              <div><span>ແພັກເກດ / ວັນໝົດອາຍຸ</span><strong>{provisionResult.subscription.plan} · {provisionResult.subscription.endsOn}</strong></div>
            </div>
            <p className="provision-password-warning">ກະລຸນາສົ່ງ Password ໃຫ້ລູກຄ້າຢ່າງປອດໄພ. ຫຼັງຈາກປິດໜ້ານີ້ຈະບໍ່ສາມາດເບິ່ງ Password ອີກ.</p>
            <div className="help-modal__footer provision-success-actions">
              <Link className="secondary-button" href="/platform-admin/pos-clients">ກັບໄປລາຍການ</Link>
              <button type="button" className="primary-button" onClick={printProvisionCredentials}><Printer size={17} /> ພິມ / ບັນທຶກເປັນ PDF</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  const message = errors[name]
  if (!message) return null

  return <span className="field-error" role="alert"><CircleAlert size={13} /> {message}</span>
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character)
}

function getFieldError(field: HTMLInputElement | HTMLSelectElement) {
  if (field.validity.typeMismatch && field.name === "email") {
    return "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ"
  }

  if (field.validity.patternMismatch && field.name === "slug") {
    return "Slug ໃຊ້ໄດ້ສະເພາະ a-z, 0-9 ແລະ -"
  }

  if (field.validity.patternMismatch && field.name === "username") {
    return "Username ໃຊ້ໄດ້ສະເພາະ a-z, A-Z, 0-9, ., _ ແລະ -"
  }

  if (field.validity.tooShort && field.name === "password") {
    return "Password ຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ"
  }

  if (field.validity.customError && field.name === "confirmPassword") {
    return "Password ທັງສອງຊ່ອງບໍ່ກົງກັນ"
  }

  return `ກະລຸນາລະບຸ ${fieldLabels[field.name] ?? "ຂໍ້ມູນນີ້"}`
}

function slugifyBusinessName(value: string, posType: string) {
  const typePrefix = posType.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "pos"
  const latinSlug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, (letter) => (letter === "Đ" ? "D" : "d"))
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")

  if (latinSlug === typePrefix || latinSlug.startsWith(`${typePrefix}-`)) return latinSlug
  if (latinSlug) return `${typePrefix}-${latinSlug}`
  return `${typePrefix}-${crypto.randomUUID().replaceAll("-", "").slice(0, 6)}`
}

function createSecurePassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lower = "abcdefghijkmnopqrstuvwxyz"
  const digits = "23456789"
  const symbols = "!@#$%&*"
  const alphabet = `${upper}${lower}${digits}${symbols}`
  const requiredCharacters = [upper, lower, digits, symbols].map(randomCharacter)
  const remainingCharacters = Array.from({ length: 12 }, () => randomCharacter(alphabet))
  const password = [...requiredCharacters, ...remainingCharacters]

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1)
    ;[password[index], password[swapIndex]] = [password[swapIndex], password[index]]
  }

  return password.join("")
}

function createUsername(businessName: string, slug: string, posType: string) {
  const sourceSlug = slug.trim() || slugifyBusinessName(businessName, posType)
  const namePart = sourceSlug
    .replace(/^[a-z0-9]+-/, "")
    .replace(/-/g, ".")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 34)

  return `owner.${namePart || "cafe"}`
}

function randomCharacter(characters: string) {
  return characters[secureRandomInt(characters.length)]
}

function secureRandomInt(max: number) {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return values[0] % max
}
