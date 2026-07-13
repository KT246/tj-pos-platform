import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudCheck,
  FileWarning,
  Info,
  Megaphone,
  Package,
  Settings,
  ShoppingBag,
  Star,
  UserRound,
  X,
  XCircle,
} from "lucide-react"
import type { ComponentType } from "react"
import { useEffect, useMemo, useState } from "react"

import type { PosToast, PosToastType } from "@/features/pos/components/notifications/pos-toast-store"
import { usePosToastStore } from "@/features/pos/components/notifications/pos-toast-store"
import { cn } from "@/lib/utils"

export function PosToastViewport() {
  const toasts = usePosToastStore((state) => state.toasts)
  const dismiss = usePosToastStore((state) => state.dismiss)

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[90] flex w-[360px] flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: PosToast
  onDismiss: (toastId: string) => void
}) {
  const meta = toastMeta[toast.type]
  const Icon = meta.icon

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(toast.id), toast.durationMs)

    return () => window.clearTimeout(timeoutId)
  }, [onDismiss, toast.durationMs, toast.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 34, y: -8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 34, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="pointer-events-auto overflow-hidden rounded-xl border border-[#eadfce] bg-white shadow-[0_18px_42px_rgba(80,54,27,0.18)]"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white",
            meta.iconClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-black text-[#3b2511]">{toast.title}</p>
          {toast.description ? (
            <p className="mt-0.5 text-xs font-semibold text-[#7c6448]">
              {toast.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#8a7560] transition hover:bg-[#fbf4ea] hover:text-[#3b2511]"
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-1.5 bg-[#f0e5d8]">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.durationMs / 1000, ease: "linear" }}
          className={cn("h-full", meta.progressClassName)}
        />
      </div>
    </motion.div>
  )
}

export function PosAlertBannerStack() {
  const [visibleAlerts, setVisibleAlerts] = useState(["printer", "stock"])

  function closeAlert(alertId: string) {
    setVisibleAlerts((items) => items.filter((item) => item !== alertId))
  }

  return visibleAlerts.length ? (
    <div className="space-y-3 px-3 pt-3">
      {visibleAlerts.includes("printer") ? (
        <PosAlertBanner
          type="warning"
          icon={AlertTriangle}
          title="Máy in hóa đơn chưa kết nối."
          description="Vui lòng kiểm tra lại."
          actionLabel="Kiểm tra ngay"
          onClose={() => closeAlert("printer")}
        />
      ) : null}
      {visibleAlerts.includes("stock") ? (
        <PosAlertBanner
          type="info"
          icon={Package}
          title="Có 5 nguyên liệu sắp hết hàng hôm nay."
          description="Kiểm tra và nhập hàng để tránh gián đoạn."
          actionLabel="Xem chi tiết"
          onClose={() => closeAlert("stock")}
        />
      ) : null}
    </div>
  ) : null
}

export function PosAlertBanner({
  type,
  icon: Icon,
  title,
  description,
  actionLabel,
  onClose,
}: {
  type: "warning" | "info"
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel: string
  onClose: () => void
}) {
  const isWarning = type === "warning"

  return (
    <div
      className={cn(
        "flex h-[62px] items-center gap-4 rounded-xl border px-5 shadow-[0_12px_28px_rgba(80,54,27,0.08)]",
        isWarning
          ? "border-[#f3d28d] bg-[#fff6dc] text-[#6f461c]"
          : "border-[#bcd5fb] bg-[#edf6ff] text-[#1f4d83]",
      )}
    >
      <Icon
        className={cn(
          "h-6 w-6 shrink-0",
          isWarning ? "text-[#e59722]" : "text-[#2e7be6]",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-[#3b2511]">
          {title}{" "}
          <span className="font-semibold text-[#7c6448]">{description}</span>
        </p>
      </div>
      <button
        type="button"
        className="cursor-pointer text-sm font-black text-[#5a3718] underline-offset-4 transition hover:underline"
      >
        {actionLabel}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#7c6448] transition hover:bg-white/55 hover:text-[#3b2511]"
        aria-label="Đóng cảnh báo"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export function PosNotificationButton() {
  const [open, setOpen] = useState(false)
  const [announcementOpen, setAnnouncementOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-xl bg-white text-[#4b321a] shadow-[0_12px_30px_rgba(80,54,27,0.06)] transition hover:bg-[#efe5d8]"
        aria-label="Mở thông báo"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f23b3b] px-1 text-xs font-black text-white">
          5
        </span>
      </button>

      <NotificationCenter
        open={open}
        onClose={() => setOpen(false)}
        onOpenAnnouncements={() => {
          setOpen(false)
          setAnnouncementOpen(true)
        }}
      />
      <AnnouncementPanel
        open={announcementOpen}
        onClose={() => setAnnouncementOpen(false)}
      />
    </div>
  )
}

function NotificationCenter({
  open,
  onClose,
  onOpenAnnouncements,
}: {
  open: boolean
  onClose: () => void
  onOpenAnnouncements: () => void
}) {
  const notifications = useMemo(
    () => [
      {
        id: "printer",
        icon: AlertTriangle,
        title: "Máy in hóa đơn bị ngắt kết nối",
        message: "Máy in tại quầy thu ngân không phản hồi.",
        time: "10:28",
        color: "red",
        important: true,
        unread: true,
      },
      {
        id: "milk",
        icon: Package,
        title: "Sữa tươi Vinamilk sắp hết hàng",
        message: "Chỉ còn 3 hộp trong kho.",
        time: "10:15",
        color: "orange",
        important: true,
        unread: true,
      },
      {
        id: "shift",
        icon: UserRound,
        title: "Nhân viên Nguyễn Minh vừa mở ca",
        message: "Ca sáng bắt đầu lúc 10:00.",
        time: "10:00",
        color: "green",
        important: false,
        unread: false,
      },
      {
        id: "backup",
        icon: CloudCheck,
        title: "Backup dữ liệu hoàn tất",
        message: "Dữ liệu đã được sao lưu lúc 23:59.",
        time: "23:59",
        color: "green",
        important: false,
        unread: false,
      },
      {
        id: "takeaway",
        icon: ShoppingBag,
        title: "Có đơn mang đi chưa thanh toán",
        message: "Đơn #HD1023 chưa thanh toán.",
        time: "21:47",
        color: "orange",
        important: true,
        unread: false,
      },
    ],
    [],
  )

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed right-3 top-[78px] z-[70] w-[430px] rounded-2xl border border-[#eadfce] bg-white p-5 shadow-[0_24px_70px_rgba(36,22,10,0.22)]"
        >
          <div className="absolute -top-2 right-20 h-4 w-4 rotate-45 border-l border-t border-[#eadfce] bg-white" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#3b2511]">Thông báo</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenAnnouncements}
                  className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#fff3dd] px-3 text-xs font-black text-[#8a5f36] transition hover:bg-[#f7e4c6]"
                >
                  <Megaphone className="h-4 w-4" />
                  Nội bộ
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#5f4a35] transition hover:bg-[#fbf4ea]"
                  aria-label="Cài đặt thông báo"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#5f4a35] transition hover:bg-[#fbf4ea]"
                  aria-label="Đóng thông báo"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 rounded-full border border-[#eadfce] bg-white p-1 text-sm font-black text-[#7c6448]">
              <TabPill active label="Tất cả" count={5} />
              <TabPill label="Chưa đọc" count={3} />
              <TabPill label="Quan trọng" count={2} />
            </div>

            <p className="mt-6 border-b border-[#eadfce] pb-3 text-sm font-semibold text-[#8a7560]">
              Hôm nay
            </p>

            <div className="max-h-[520px] overflow-y-auto">
              {notifications.slice(0, 3).map((item) => (
                <NotificationItem key={item.id} item={item} />
              ))}

              <p className="mt-4 border-b border-[#eadfce] pb-3 text-sm font-semibold text-[#8a7560]">
                Hôm qua
              </p>
              {notifications.slice(3).map((item) => (
                <NotificationItem key={item.id} item={item} />
              ))}
            </div>

            <button
              type="button"
              className="mt-4 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#f3ece3] text-sm font-black text-[#5a3718] transition hover:bg-[#e8dccd]"
            >
              Xem tất cả thông báo
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function AnnouncementPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const announcements = [
    {
      id: "open-time",
      title: "Từ ngày mai quán mở cửa lúc 06:30.",
      message: "Áp dụng từ ngày 21/05/2024. Vui lòng có mặt đúng giờ để chuẩn bị ca.",
      time: "Hôm nay, 10:15",
      read: false,
    },
    {
      id: "peach-tea",
      title: "Không bán món Trà đào sau 20:00 vì hết nguyên liệu.",
      message: "Mong mọi người lưu ý khi tư vấn cho khách.",
      time: "Hôm nay, 09:45",
      read: false,
    },
    {
      id: "stock-check",
      title: "Kiểm kê kho định kỳ cuối tuần.",
      message: "Thời gian: Chủ nhật, 19/05/2024 lúc 14:00. Đề nghị các bộ phận phối hợp đầy đủ.",
      time: "18/05/2024, 16:30",
      read: true,
    },
  ]

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#2a1c10]/25"
            onClick={onClose}
          />
          <motion.aside
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 48 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-3 right-3 top-3 z-[81] flex w-[430px] flex-col rounded-2xl border border-[#eadfce] bg-white p-5 shadow-[0_24px_70px_rgba(36,22,10,0.28)]"
          >
            <div className="flex items-start justify-between border-b border-[#eadfce] pb-5">
              <div className="flex gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0cf] text-[#8a5f36]">
                  <Bell className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-[#3b2511]">
                    Thông báo nội bộ
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[#7c6448]">
                    Cập nhật từ quản lý cửa hàng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#5f4a35] transition hover:bg-[#fbf4ea]"
                aria-label="Đóng thông báo nội bộ"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#f3ece3] px-4 text-sm font-black text-[#5a3718]"
              >
                Tất cả
                <ChevronRight className="h-4 w-4 rotate-90" />
              </button>
              <button
                type="button"
                className="h-10 cursor-pointer rounded-lg border border-[#eadfce] bg-white px-4 text-sm font-black text-[#5a3718] transition hover:bg-[#fbf4ea]"
              >
                Đánh dấu đã đọc tất cả
              </button>
            </div>

            <div className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto">
              {announcements.map((item) => (
                <article
                  key={item.id}
                  className={cn(
                    "rounded-xl border p-4",
                    item.read
                      ? "border-[#eadfce] bg-white"
                      : "border-[#f2cb82] bg-[#fff8e8]",
                  )}
                >
                  <div className="flex gap-4">
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                        item.read
                          ? "bg-[#efeae3] text-[#8a7560]"
                          : "bg-[#ffe7b8] text-[#8a5f36]",
                      )}
                    >
                      <Megaphone className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        {!item.read ? (
                          <span className="rounded-full bg-[#fff0cf] px-2.5 py-1 text-xs font-black text-[#e27b1d]">
                            Mới
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="shrink-0 text-sm font-semibold text-[#8a7560]">
                          {item.time}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-black leading-6 text-[#3b2511]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#6f5b46]">
                        {item.message}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="h-11 cursor-pointer rounded-lg border border-[#d7c4ab] bg-white text-sm font-black text-[#5a3718] transition hover:bg-[#fbf4ea]"
                        >
                          Xem chi tiết
                        </button>
                        {item.read ? (
                          <span className="flex h-11 items-center justify-center gap-2 text-sm font-black text-[#7c6448]">
                            <Check className="h-4 w-4" />
                            Đã đọc
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="h-11 cursor-pointer rounded-lg bg-[linear-gradient(135deg,#6d421f_0%,#3b2511_100%)] text-sm font-black text-white transition hover:brightness-110"
                          >
                            Đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 flex h-14 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#eadfce] bg-white text-sm font-black text-[#5a3718] transition hover:bg-[#fbf4ea]"
            >
              Xem tất cả thông báo
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export function PosConfirmDialog({
  open,
  title,
  description,
  tone = "danger",
  confirmLabel,
  cancelLabel = "Hủy",
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  description: string
  tone?: "danger" | "default"
  confirmLabel: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-[#2a1c10]/58 p-5 backdrop-blur-[1px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-[470px] rounded-2xl border border-[#eadfce] bg-white px-9 py-8 text-center shadow-[0_24px_70px_rgba(36,22,10,0.28)]"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#5f4a35] transition hover:bg-[#fbf4ea]"
                aria-label="Đóng xác nhận"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <span
              className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
                tone === "danger"
                  ? "bg-[#fff0d6] text-[#f09721]"
                  : "bg-[#f3ece3] text-[#8a5f36]",
              )}
            >
              {tone === "danger" ? (
                <AlertTriangle className="h-10 w-10" />
              ) : (
                <FileWarning className="h-10 w-10" />
              )}
            </span>
            <h2 className="mt-6 text-xl font-black text-[#3b2511]">{title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#6f5b46]">
              {description}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="h-[52px] cursor-pointer rounded-xl border border-[#eadfce] bg-white text-sm font-black text-[#5f4a35] transition hover:bg-[#fbf4ea]"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  "h-[52px] cursor-pointer rounded-xl text-sm font-black text-white shadow-[0_16px_30px_rgba(80,54,27,0.18)] transition hover:brightness-110",
                  tone === "danger"
                    ? "bg-[#d7272f]"
                    : "bg-[linear-gradient(135deg,#6d421f_0%,#3b2511_100%)]",
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function TabPill({
  label,
  count,
  active = false,
}: {
  label: string
  count: number
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full transition",
        active ? "bg-[#4b321a] text-white" : "text-[#7c6448] hover:bg-[#fbf4ea]",
      )}
    >
      {label}
      <span
        className={cn(
          "flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs",
          active ? "bg-white text-[#4b321a]" : "bg-[#f1e8dd] text-[#8a7560]",
        )}
      >
        {count}
      </span>
    </button>
  )
}

function NotificationItem({
  item,
}: {
  item: {
    icon: ComponentType<{ className?: string }>
    title: string
    message: string
    time: string
    color: string
    important: boolean
    unread: boolean
  }
}) {
  const Icon = item.icon

  return (
    <article className="flex gap-4 border-b border-[#eadfce] py-4">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          item.color === "red"
            ? "bg-[#ffe3e3] text-[#f23b3b]"
            : item.color === "orange"
              ? "bg-[#fff0dc] text-[#ed8427]"
              : "bg-[#eaf7ec] text-[#209548]",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-3">
          <h3 className="truncate text-sm font-black text-[#3b2511]">{item.title}</h3>
          <span className="shrink-0 text-sm font-semibold text-[#7c6448]">
            {item.time}
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-[#6f5b46]">{item.message}</p>
      </div>
      <div className="flex w-5 shrink-0 flex-col items-center justify-center gap-3">
        {item.important ? <Star className="h-4 w-4 fill-[#f39b27] text-[#f39b27]" /> : null}
        {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-[#f23b3b]" /> : null}
      </div>
    </article>
  )
}

const toastMeta: Record<
  PosToastType,
  {
    icon: ComponentType<{ className?: string }>
    iconClassName: string
    progressClassName: string
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClassName: "bg-[#23ad44]",
    progressClassName: "bg-[#23ad44]",
  },
  error: {
    icon: XCircle,
    iconClassName: "bg-[#ef3f3f]",
    progressClassName: "bg-[#ef3f3f]",
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: "bg-[#f4a51f]",
    progressClassName: "bg-[#f4a51f]",
  },
  info: {
    icon: Info,
    iconClassName: "bg-[#3d87df]",
    progressClassName: "bg-[#3d87df]",
  },
}
