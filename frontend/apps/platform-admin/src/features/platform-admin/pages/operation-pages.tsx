import { Clock, Mail, MessageSquare, Phone, Send, Ticket, User } from "lucide-react";

import {
  AdminButton,
  AdminCard,
  FilterBar,
  PageHeader,
  Pagination,
  PanelTitle,
  SimpleList,
  StatusBadge
} from "../components/admin-primitives";
import { requests, tickets } from "../data/mock-platform-admin";

export function ContactRequestsPage() {
  return (
    <>
      <PageHeader
        title="ຄຳຂໍຕິດຕໍ່"
        description="ຄຳຂໍຈາກ website ຫຼັກທີ່ລໍຖ້າທີມ TJ POS ຕິດຕໍ່ກັບ."
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາຄຳຂໍ..."
          filters={["ແຫຼ່ງທີ່ມາ", "ສະຖານະ", "ແຂວງ"]}
        />
        <RecordsTable type="request" />
      </AdminCard>
    </>
  );
}

export function ContactRequestDetailPage() {
  const record = requests[0];

  return (
    <>
      <PageHeader
        title={record.id}
        description="ລາຍລະອຽດຄຳຂໍ, contact info, activity ແລະ next action."
        action={<AdminButton icon={Send}>ຕິດຕໍ່ກັບ</AdminButton>}
      />
      <DetailLayout
        title={record.title}
        status={record.status}
        left={[
          ["ຊື່", "Khampheng L."],
          ["Email", "khampheng@example.la"],
          ["ເບີໂທ", "+856 20 5555 7890"],
          ["ປະເພດທຸລະກິດ", "ຮ້ານກາເຟ"],
          ["ແຂວງ", "ນະຄອນຫຼວງວຽງຈັນ"],
          ["ສ້າງເມື່ອ", record.meta]
        ]}
        message="ລູກຄ້າສົນໃຈ TJ POS ສຳລັບຮ້ານກາເຟໃໝ່ ແລະຕ້ອງການຄຳປຶກສາເລື່ອງ package."
      />
    </>
  );
}

export function SupportTicketsPage() {
  return (
    <>
      <PageHeader
        title="ຕິດຕາມການຊ່ວຍເຫຼືອ"
        description="ຕິດຕາມ ticket, priority, assignment ແລະ resolution status."
      />
      <AdminCard className="overflow-hidden">
        <FilterBar
          searchPlaceholder="ຄົ້ນຫາ ticket..."
          filters={["ຄວາມສຳຄັນ", "ສະຖານະ", "ຜູ້ຮັບຜິດຊອບ"]}
        />
        <RecordsTable type="ticket" />
      </AdminCard>
    </>
  );
}

export function SupportTicketDetailPage() {
  const ticket = tickets[0];

  return (
    <>
      <PageHeader
        title={ticket.id}
        description="ລາຍລະອຽດ Ticket, ການສົນທະນາ, note ພາຍໃນ ແລະ ຂັ້ນຕອນແກ້ໄຂ."
        action={<AdminButton>ປິດ Ticket</AdminButton>}
      />
      <DetailLayout
        title={ticket.title}
        status={ticket.status}
        left={[
          ["ທຸລະກິດ", ticket.subtitle],
          ["ຄວາມສຳຄັນ", "ສູງ"],
          ["ຜູ້ຮັບຜິດຊອບ", "Vannapha Support"],
          ["Channel", "Web Support"],
          ["ສ້າງເມື່ອ", "ພຶດສະພາ 18, 2025, 10:24 AM"],
          ["ອັບເດດເມື່ອ", "ພຶດສະພາ 18, 2025, 11:02 AM"]
        ]}
        message="Printer ບໍ່ພິມບິນຫຼັງຈາກ update. ລູກຄ້າຕ້ອງການໃຫ້ກວດ configuration ແລະ paper size."
      />
    </>
  );
}

function RecordsTable({ type }: { type: "request" | "ticket" }) {
  const rows = type === "request" ? requests : tickets;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              {[
                type === "request" ? "Request ID" : "Ticket ID",
                "ຫົວຂໍ້",
                "ທຸລະກິດ / ແຂວງ",
                "ສະຖານະ",
                "ຂໍ້ມູນ",
                "ການກະທຳ"
              ].map((head) => (
                <th key={head} className="font900 border-b border-blue-100 px-4 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/40">
                <td className="font900 px-4 py-3 text-blue-700">{row.id}</td>
                <td className="font900 px-4 py-3 text-slate-950">
                  {row.title}
                </td>
                <td className="px-4 py-3 text-slate-700">{row.subtitle}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{row.meta}</td>
                <td className="px-4 py-3">
                  <AdminButton
                    variant="secondary"
                    href={
                      type === "request"
                        ? `/platform-admin/contact-requests/${row.id}`
                        : `/platform-admin/support-tickets/${row.id}`
                    }
                  >
                    ເບິ່ງ
                  </AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
}

function DetailLayout({
  title,
  status,
  left,
  message
}: {
  title: string;
  status:
    | "active"
    | "trial"
    | "suspended"
    | "pending"
    | "new"
    | "inProgress"
    | "closed"
    | "resolved"
    | "inactive";
  left: [string, string][];
  message: string;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <AdminCard className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font900 text-xl text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
            </div>
            <StatusBadge status={status} />
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ການສົນທະນາ" />
          <div className="space-y-4">
            {[
              ["ລູກຄ້າ", message, "10:24 AM"],
              [
                "TJ POS Support",
                "ຮັບຂໍ້ມູນແລ້ວ. ທີມງານຈະຕິດຕໍ່ກັບໄປໃນໄວໆນີ້.",
                "10:42 AM"
              ]
            ].map(([who, text, time]) => (
              <div key={time} className="rounded-lg border border-blue-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font900 text-sm text-slate-950">{who}</span>
                  <span className="text-xs text-slate-500">{time}</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
      <div className="space-y-5">
        <AdminCard className="p-5">
          <PanelTitle title="ລາຍລະອຽດ" />
          <div className="space-y-4 text-sm">
            {left.map(([label, value]) => (
              <div key={label} className="flex items-start gap-3">
                <IconDot label={label} />
                <div>
                  <p className="font800 text-xs text-slate-500">{label}</p>
                  <p className="font900 mt-1 text-slate-950">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <PanelTitle title="ການກະທຳຖັດໄປ" />
          <SimpleList
            records={[
              {
                title: "ມອບໝາຍຜູ້ຮັບຜິດຊອບ",
                subtitle: "Vannapha Support",
                meta: "ຕອນນີ້",
                status: "active"
              },
              {
                title: "ຕັ້ງການເຕືອນ",
                subtitle: "ຕິດຕາມລູກຄ້າ",
                meta: "ມື້ອື່ນ",
                status: "pending"
              },
              {
                title: "ເພີ່ມ note ພາຍໃນ",
                subtitle: "ເຫັນໄດ້ໂດຍທີມ TJ POS",
                meta: "ບໍ່ບັງຄັບ",
                status: "new"
              }
            ]}
          />
        </AdminCard>
      </div>
    </div>
  );
}

function IconDot({ label }: { label: string }) {
  const icons = {
    Email: Mail,
    Phone,
    Created: Clock,
    User,
    Ticket,
    Message: MessageSquare
  };
  const Icon = label.includes("Email")
    ? icons.Email
    : label.includes("ເບີໂທ")
      ? icons.Phone
      : label.includes("Created")
        ? icons.Created
        : label.includes("Ticket")
          ? icons.Ticket
          : label.includes("Message")
            ? icons.Message
            : icons.User;

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Icon className="h-4 w-4" />
    </span>
  );
}
