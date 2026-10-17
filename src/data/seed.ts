import type { Experience, TimeSlot, Venue } from '@/domain/types'

// Fictional venues and experiences in Querétaro. Prices in MXN cents, VAT included.

export const venues: Venue[] = [
  {
    id: 'casa-faroles',
    name: 'Museo Casa de los Faroles',
    city: 'Querétaro',
    timezone: 'America/Mexico_City',
  },
  {
    id: 'pena-alta',
    name: 'Peña Alta Expediciones',
    city: 'Querétaro',
    timezone: 'America/Mexico_City',
  },
]

export const experiences: Experience[] = [
  {
    id: 'faroles-guided-tour',
    venueId: 'casa-faroles',
    name: 'Visita guiada: la ciudad de cantera',
    description: 'Recorrido de 90 minutos por las salas del museo con un guía.',
    durationMinutes: 90,
    prices: { adult: 18000, child: 9000, senior: 9000 },
  },
  {
    id: 'faroles-night-tour',
    venueId: 'casa-faroles',
    name: 'Leyendas a la luz de los faroles',
    description: 'Recorrido nocturno por el centro histórico con relatos de leyendas locales.',
    durationMinutes: 75,
    prices: { adult: 25000, child: 15000, senior: 18000 },
  },
  {
    id: 'pena-kayak',
    venueId: 'pena-alta',
    name: 'Kayak en la presa',
    description: 'Dos horas de kayak guiado; incluye chaleco y equipo.',
    durationMinutes: 120,
    prices: { adult: 45000, child: 30000, senior: 35000 },
  },
  {
    id: 'pena-rappel',
    venueId: 'pena-alta',
    name: 'Rappel para principiantes',
    description: 'Clase de rappel en pared natural con instructores certificados.',
    durationMinutes: 180,
    prices: { adult: 65000, child: 50000, senior: 55000 },
  },
]

interface WeeklySchedule {
  experienceId: string
  /** 0 = Sunday … 6 = Saturday */
  weekdays: number[]
  /** Local start times, "HH:MM". */
  times: string[]
  capacity: number
}

const schedules: WeeklySchedule[] = [
  {
    experienceId: 'faroles-guided-tour',
    weekdays: [2, 3, 4, 5, 6, 0],
    times: ['10:00', '12:00', '16:00'],
    capacity: 20,
  },
  { experienceId: 'faroles-night-tour', weekdays: [5, 6], times: ['20:00'], capacity: 25 },
  { experienceId: 'pena-kayak', weekdays: [6, 0], times: ['09:00', '12:00'], capacity: 15 },
  { experienceId: 'pena-rappel', weekdays: [6], times: ['08:00'], capacity: 8 },
]

// Mexico City is UTC-6 year-round.
const MEXICO_CITY_OFFSET = '-06:00'

/**
 * Time slots for the next `days` days starting at `fromDate` ("YYYY-MM-DD").
 * Built relative to a date so the demo always has future slots. `sold` follows a
 * fixed pattern so some slots are nearly full and some are sold out.
 */
export function seedSlots(fromDate: string, days: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let dayIndex = 0; dayIndex < days; dayIndex++) {
    const day = new Date(`${fromDate}T00:00:00Z`)
    day.setUTCDate(day.getUTCDate() + dayIndex)
    const date = day.toISOString().slice(0, 10)

    for (const schedule of schedules) {
      if (!schedule.weekdays.includes(day.getUTCDay())) continue
      schedule.times.forEach((time, timeIndex) => {
        slots.push({
          id: `${schedule.experienceId}-${date}-${time.replace(':', '')}`,
          experienceId: schedule.experienceId,
          startsAt: `${date}T${time}:00${MEXICO_CITY_OFFSET}`,
          capacity: schedule.capacity,
          sold: (dayIndex * 3 + timeIndex * 5) % (schedule.capacity + 1),
        })
      })
    }
  }
  return slots
}
