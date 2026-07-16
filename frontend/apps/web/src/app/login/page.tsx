"use client"

import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react"
import { useState } from "react"

export default function PlatformLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim() || !password) {
      setError("ກະລຸນາປ້ອນ Username ແລະ Password")
      return
    }

    setSubmitting(true)
    setError("")
    try {
      const response = await fetch("/api/platform/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (!response.ok) {
        setError(response.status === 403 ? "ບັນຊີນີ້ບໍ່ມີສິດ Platform Admin" : "Username ຫຼື Password ບໍ່ຖືກຕ້ອງ")
        return
      }
      window.location.assign("/platform-admin")
    } catch {
      setError("ບໍ່ສາມາດເຊື່ອມຕໍ່ Backend ໄດ້")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="platform-login-page">
      <section className="platform-login-card">
        <div className="platform-login-brand"><span><ShieldCheck size={25} /></span><div><strong>TJ POS</strong><small>PLATFORM ADMIN</small></div></div>
        <div className="platform-login-heading"><span><LockKeyhole size={24} /></span><h1>ເຂົ້າລະບົບ Admin</h1><p>ສຳລັບທີມ TJ Solution ເທົ່ານັ້ນ</p></div>
        <form onSubmit={handleSubmit}>
          <label className="login-field"><span>Username</span><div><UserRound size={18} /><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" /></div></label>
          <label className="login-field"><span>Password</span><div><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {error && <p className="platform-login-error">{error}</p>}
          <button className="platform-login-submit" type="submit" disabled={submitting}>{submitting ? "ກຳລັງເຂົ້າ..." : "ເຂົ້າລະບົບ"}</button>
        </form>
      </section>
    </main>
  )
}
