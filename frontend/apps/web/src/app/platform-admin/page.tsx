import Link from "next/link"
import { ArrowUpRight, Building2, CircleCheck, Clock3, CreditCard, Plus, Store } from "lucide-react"

const metrics = [
  { label: "POS ທີ່ມອບແລ້ວ", value: "24", detail: "+3 ໃນເດືອນນີ້", icon: Building2, tone: "blue" },
  { label: "ບໍລິການທີ່ໃຊ້ງານ", value: "21", detail: "87.5% ຂອງທັງໝົດ", icon: CircleCheck, tone: "green" },
  { label: "ໃກ້ໝົດອາຍຸ", value: "3", detail: "ພາຍໃນ 30 ວັນ", icon: Clock3, tone: "amber" },
  { label: "ລໍຖ້າຊຳລະ", value: "4", detail: "ຕ້ອງຕິດຕາມ", icon: CreditCard, tone: "violet" },
] as const

const recentBusinesses = [
  { name: "TJ Café Vientiane", owner: "ສົມໄຊ ພົມມະແສງ", plan: "Business", status: "ເປີດໃຊ້", date: "15 ກ.ລ. 2026" },
  { name: "Mekong Coffee", owner: "ຈັນທະລາ ສີສຸວັນ", plan: "Starter", status: "ລໍຖ້າ", date: "14 ກ.ລ. 2026" },
  { name: "Sabaidee Bakery", owner: "ນິດດາ ວົງສະຫວັນ", plan: "Business", status: "ເປີດໃຊ້", date: "12 ກ.ລ. 2026" },
  { name: "Khampheng Mini Mart", owner: "ຄຳແພງ ແກ້ວມະນີ", plan: "Starter", status: "ເປີດໃຊ້", date: "10 ກ.ລ. 2026" },
]

export default function PlatformAdminDashboard() {
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">PLATFORM OVERVIEW</p>
          <h1>ພາບລວມລະບົບ</h1>
          <p>ສ້າງ, ມອບ ແລະ ຕິດຕາມບໍລິການ TJ POS ສຳລັບລູກຄ້າ</p>
        </div>
        <Link className="primary-button" href="/platform-admin/pos-clients/create">
          <Plus size={18} strokeWidth={2.4} />
          ມອບ POS ໃໝ່
        </Link>
      </section>

      <section className="metric-grid" aria-label="ສະຫຼຸບຂໍ້ມູນ">
        {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
          <article className="metric-card" key={label}>
            <div className={`metric-icon metric-icon--${tone}`}><Icon size={21} /></div>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>{detail}</span>
          </article>
        ))}
      </section>

      <section className="content-card">
        <div className="card-heading">
          <div>
            <h2>POS ທີ່ມອບຫຼ້າສຸດ</h2>
            <p>ບໍລິການ POS ທີ່ສ້າງໃຫ້ລູກຄ້າຫຼ້າສຸດ</p>
          </div>
          <Link className="text-link" href="/platform-admin/pos-clients">
            ເບິ່ງທັງໝົດ <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ຊື່ຮ້ານ</th><th>ເຈົ້າຂອງ</th><th>ແພັກເກດ</th><th>ສະຖານະ</th><th>ວັນທີສ້າງ</th></tr>
            </thead>
            <tbody>
              {recentBusinesses.map((business) => (
                <tr key={business.name}>
                  <td><span className="business-name"><span><Store size={17} /></span>{business.name}</span></td>
                  <td>{business.owner}</td>
                  <td>{business.plan}</td>
                  <td><span className={business.status === "ເປີດໃຊ້" ? "status status--active" : "status status--pending"}>{business.status}</span></td>
                  <td>{business.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
