import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertTriangle, Info } from 'lucide-react'

interface Toast {
  id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'error'
  color?: string
  duration?: number
}

const iconMap = {
  info: Info,
  success: Check,
  warning: AlertTriangle,
  error: AlertTriangle,
}

const colorMap = {
  info: 'border-blue-500/30 bg-blue-500/10',
  success: 'border-green-500/30 bg-green-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
  error: 'border-red-500/30 bg-red-500/10',
}

export function NotificationToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((detail: any) => {
    const typeMap: Record<string, Toast['type']> = {
      general: 'info', urgent: 'error', exam: 'warning', event: 'success', announcement: 'info',
    }
    const newToast: Toast = {
      id: Date.now().toString(),
      title: detail.title || 'Notification',
      body: detail.body || '',
      type: typeMap[detail.notification_type] || 'info',
      color: detail.color_tag,
      duration: detail.notification_type === 'urgent' ? 8000 : 5000,
    }
    setToasts(prev => [...prev.slice(-4), newToast])
  }, [])

  useEffect(() => {
    const handler = (e: Event) => addToast((e as CustomEvent).detail)
    window.addEventListener('acaedu:notification', handler)
    return () => window.removeEventListener('acaedu:notification', handler)
  }, [addToast])

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = iconMap[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className={`pointer-events-auto backdrop-blur-xl border rounded-xl p-4 shadow-2xl ${colorMap[toast.type]}`}
              onAnimationComplete={() => {
                setTimeout(() => dismiss(toast.id), toast.duration || 5000)
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-white/10">
                  <Icon size={14} className="text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">{toast.title}</p>
                  <p className="text-[12px] text-white/60 mt-0.5 leading-relaxed">{toast.body}</p>
                </div>
                <button onClick={() => dismiss(toast.id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={12} className="text-white/40" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
