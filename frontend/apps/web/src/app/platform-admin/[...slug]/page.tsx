import Link from "next/link"
import { ArrowLeft, Construction, Plus } from "lucide-react"

const pageNames: Record<string, string> = {
  "pos-clients": "POS ລູກຄ້າ",
  "pos-clients/create": "ສ້າງ ແລະ ມອບ POS ໃໝ່",
  plans: "ແພັກເກດບໍລິການ",
  "add-ons": "ຟີເຈີເສີມ",
  subscriptions: "ສະໝັກ ແລະ ຕໍ່ອາຍຸ",
  payments: "ການຊຳລະເງິນ",
  "support-tickets": "ສູນຊ່ວຍເຫຼືອ",
  "audit-logs": "ປະຫວັດການໃຊ້ງານ",
  settings: "ຕັ້ງຄ່າລະບົບ",
}

export default async function AdminPlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const path = slug.join("/")
  const title = pageNames[path] ?? "ໜ້າຈັດການ"
  const isPosClients = path === "pos-clients"

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">TJ POS ADMIN</p>
          <h1>{title}</h1>
          <p>ເມນູນີ້ຖືກກຽມໄວ້ແລ້ວ ແລະ ສາມາດເລີ່ມພັດທະນາໄດ້ທັນທີ</p>
        </div>
        {isPosClients && (
          <Link className="primary-button" href="/platform-admin/pos-clients/create">
            <Plus size={18} /> ມອບ POS ໃໝ່
          </Link>
        )}
      </section>

      <section className="empty-state">
        <span className="empty-state__icon"><Construction size={32} /></span>
        <h2>{title}</h2>
        <p>ໂຄງໜ້າ ແລະ route ພ້ອມແລ້ວ. ສ່ວນຂໍ້ມູນ, form ແລະ API ຈະເພີ່ມໃນຮອບຕໍ່ໄປ.</p>
        <Link className="secondary-button" href="/platform-admin"><ArrowLeft size={17} /> ກັບໄປໜ້າຫຼັກ</Link>
      </section>
    </div>
  )
}
