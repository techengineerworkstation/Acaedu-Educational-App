import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  event_date: string
  end_date?: string
  event_type?: string
  location?: string
  description?: string
}

interface Props {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const typeColors: Record<string, string> = {
  academic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  exam: 'bg-red-500/20 text-red-300 border-red-500/30',
  social: 'bg-green-500/20 text-green-300 border-green-500/30',
  holiday: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  seminar: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
}

export function EventCalendar({ events, onEventClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => { setCurrentDate(new Date()); setSelectedDate(new Date()) }

  const calendarDays = useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = []
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false, isToday: false })
    }
    const today = new Date()
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      })
    }
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false, isToday: false })
    }
    return days
  }, [year, month, firstDay, daysInMonth, daysInPrevMonth])

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => e.event_date?.startsWith(dateStr))
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div>
          <h3 className="text-[16px] font-bold text-[var(--color-text)]">{MONTHS[month]} {year}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={goToday} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-colors">Today</button>
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"><ChevronLeft size={16} className="text-white/50" /></button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"><ChevronRight size={16} className="text-white/50" /></button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-white/5">
        {DAYS.map(day => (
          <div key={day} className="p-2 text-center text-[11px] font-medium text-white/30 uppercase">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => {
          const dayEvents = getEventsForDate(day.date)
          const isSelected = selectedDate?.toDateString() === day.date.toDateString()
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day.date)}
              className={`relative p-2 min-h-[60px] text-left border-b border-r border-white/3 transition-colors
                ${day.isCurrentMonth ? 'text-white/70 hover:bg-white/5' : 'text-white/20'}
                ${day.isToday ? 'bg-[var(--color-primary)]/10' : ''}
                ${isSelected ? 'bg-white/10 ring-1 ring-[var(--color-primary)]/30' : ''}
              `}
            >
              <span className={`text-[12px] font-medium ${day.isToday ? 'text-[var(--color-primary-light)]' : ''}`}>
                {day.date.getDate()}
              </span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-1 flex-wrap">
                  {dayEvents.slice(0, 3).map((e, j) => (
                    <span key={j} className={`w-1.5 h-1.5 rounded-full ${typeColors[e.event_type || 'academic']?.split(' ')[0] || 'bg-white/30'}`} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date events */}
      {selectedEvents.length > 0 && (
        <div className="p-4 border-t border-white/5">
          <h4 className="text-[13px] font-semibold text-white/60 mb-3">Events on {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
          <div className="space-y-2">
            {selectedEvents.map(event => (
              <motion.button
                key={event.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => onEventClick?.(event)}
                className={`w-full text-left p-3 rounded-xl border ${typeColors[event.event_type || 'academic'] || 'border-white/10 bg-white/5'} transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <CalendarDays size={14} className="mt-0.5 flex-shrink-0 opacity-60" />
                  <div>
                    <p className="text-[13px] font-semibold">{event.title}</p>
                    {event.description && <p className="text-[11px] opacity-60 mt-0.5">{event.description}</p>}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] opacity-50">
                      {event.event_date && <span className="flex items-center gap-1"><Clock size={10} />{new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
                      {event.location && <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
