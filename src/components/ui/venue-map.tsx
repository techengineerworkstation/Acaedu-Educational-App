import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Building2, Users, X, ExternalLink } from 'lucide-react'

interface Venue {
  id: string
  name: string
  building?: string
  floor?: string
  capacity?: number
  photo_url?: string
  directions?: string
  latitude?: number
  longitude?: number
}

interface Props {
  venues: Venue[]
  onSelect?: (venue: Venue) => void
}

export function VenueLocator({ venues, onSelect }: Props) {
  const [selected, setSelected] = useState<Venue | null>(null)
  const [filter, setFilter] = useState('')

  const filtered = venues.filter(v =>
    v.name.toLowerCase().includes(filter.toLowerCase()) ||
    v.building?.toLowerCase().includes(filter.toLowerCase())
  )

  const openInMaps = (venue: Venue) => {
    if (venue.latitude && venue.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`, '_blank')
    } else if (venue.name) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}`, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search venues..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[13px] text-white/80 placeholder:text-white/25 outline-none focus:border-[var(--color-primary)]/50 transition-colors"
          />
        </div>
      </div>

      {/* Venue grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(venue => (
          <motion.div
            key={venue.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => { setSelected(venue); onSelect?.(venue) }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/20 transition-all"
          >
            {venue.photo_url ? (
              <div className="h-32 bg-white/5 relative overflow-hidden">
                <img src={venue.photo_url} alt={venue.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center">
                <Building2 size={32} className="text-white/15" />
              </div>
            )}
            <div className="p-3">
              <h4 className="text-[13px] font-semibold text-white/90">{venue.name}</h4>
              <p className="text-[11px] text-white/40 mt-0.5">
                {venue.building && `${venue.building}`}{venue.floor ? `, Floor ${venue.floor}` : ''}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-white/30">
                  <Users size={10} /> {venue.capacity || 0}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--color-bg-card)] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {selected.photo_url && (
                <div className="h-48 relative overflow-hidden">
                  <img src={selected.photo_url} alt={selected.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[18px] font-bold text-white">{selected.name}</h3>
                    <p className="text-[13px] text-white/50 mt-1">
                      {selected.building}{selected.floor ? ` • Floor ${selected.floor}` : ''}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={16} className="text-white/40" /></button>
                </div>
                <div className="flex items-center gap-4 mt-4 text-[13px] text-white/50">
                  <span className="flex items-center gap-1.5"><Users size={14} /> Capacity: {selected.capacity}</span>
                </div>
                {selected.directions && (
                  <p className="mt-3 text-[12px] text-white/40 leading-relaxed">{selected.directions}</p>
                )}
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => openInMaps(selected)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--color-primary)] text-white text-[13px] font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    <Navigation size={14} /> Get Directions
                  </button>
                  <button
                    onClick={() => onSelect?.(selected)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 text-white/70 text-[13px] font-semibold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink size={14} /> Select Venue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
