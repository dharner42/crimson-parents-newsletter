import { useState } from 'react'
import type { NewsletterSection, Theme, TodoItem, BirthdayEntry, BirthAnnouncement, UpcomingEvent, SemesterDate } from '../types'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  section: NewsletterSection
  onChange: (data: object) => void
  theme: Theme
  user: User
  newsletterId: string
}

export default function SectionEditor({ section, onChange, theme, user: _user, newsletterId: _newsletterId }: Props) {
  const d = section.data

  switch (section.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <Field label="Club Name">
            <input className="input" value={d.clubName || ''} onChange={e => onChange({ clubName: e.target.value })} placeholder="Crimson Parents Club" />
          </Field>
          <Field label="Tagline">
            <input className="input" value={d.tagline || ''} onChange={e => onChange({ tagline: e.target.value })} placeholder="Harvard Business School" />
          </Field>
          <Field label="Newsletter Date">
            <input className="input" value={d.newsletterDate || ''} onChange={e => onChange({ newsletterDate: e.target.value })} placeholder="April 2026" />
          </Field>
          <Field label="Banner Photo URL (optional)">
            <input className="input" value={d.bannerPhotoUrl || ''} onChange={e => onChange({ bannerPhotoUrl: e.target.value })} placeholder="https://..." />
          </Field>
        </div>
      )

    case 'presidentMessage':
      return (
        <div className="space-y-4">
          <Field label="President's Name">
            <input className="input" value={d.presidentName || ''} onChange={e => onChange({ presidentName: e.target.value })} placeholder="Claire" />
          </Field>
          <Field label="Message">
            <textarea
              className="input"
              rows={8}
              value={d.message || ''}
              onChange={e => onChange({ message: e.target.value })}
              placeholder="Hello Crimson Parents! We hope everyone had a wonderful week…"
            />
          </Field>
        </div>
      )

    case 'todoList':
      return (
        <TodoListEditor
          items={d.items || []}
          onChange={items => onChange({ items })}
          theme={theme}
        />
      )

    case 'birthdays':
      return (
        <BirthdaysEditor
          birthdays={d.birthdays || []}
          onChange={birthdays => onChange({ birthdays })}
          theme={theme}
        />
      )

    case 'birthAnnouncements':
      return (
        <BirthAnnouncementsEditor
          announcements={d.announcements || []}
          onChange={announcements => onChange({ announcements })}
          theme={theme}
        />
      )

    case 'upcomingEvents':
      return (
        <EventsEditor
          events={d.events || []}
          onChange={events => onChange({ events })}
          theme={theme}
        />
      )

    case 'playgroups':
      return (
        <div className="space-y-4">
          <Field label="Description">
            <textarea
              className="input"
              rows={5}
              value={d.playgroupsText || ''}
              onChange={e => onChange({ playgroupsText: e.target.value })}
              placeholder="We have you covered Tuesday through Friday with fun kid activities!"
            />
          </Field>
          <Field label="Link URL (optional)">
            <input className="input" value={d.playgroupsLink || ''} onChange={e => onChange({ playgroupsLink: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Link Label">
            <input className="input" value={d.playgroupsLinkLabel || ''} onChange={e => onChange({ playgroupsLinkLabel: e.target.value })} placeholder="Playgroups Guide" />
          </Field>
        </div>
      )

    case 'semesterDates':
      return (
        <SemesterDatesEditor
          dates={d.dates || []}
          onChange={dates => onChange({ dates })}
          theme={theme}
        />
      )

    case 'clubSponsor':
      return (
        <div className="space-y-4">
          <Field label="Sponsor Name">
            <input className="input" value={d.sponsorName || ''} onChange={e => onChange({ sponsorName: e.target.value })} placeholder="Harvard Co-op" />
          </Field>
          <Field label="Logo URL (optional)">
            <input className="input" value={d.sponsorLogoUrl || ''} onChange={e => onChange({ sponsorLogoUrl: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Website Link">
            <input className="input" value={d.sponsorLink || ''} onChange={e => onChange({ sponsorLink: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Description">
            <textarea className="input" rows={3} value={d.sponsorDescription || ''} onChange={e => onChange({ sponsorDescription: e.target.value })} placeholder="Thank you to our generous sponsor!" />
          </Field>
        </div>
      )

    default:
      return <p className="text-sm text-gray-400">No editor for this section type.</p>
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</label>
      {children}
    </div>
  )
}

// Inject global input styles
const inputCSS = `
.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  resize: vertical;
}
.input:focus { border-color: #A51C30; }
`
if (!document.getElementById('editor-input-styles')) {
  const style = document.createElement('style')
  style.id = 'editor-input-styles'
  style.textContent = inputCSS
  document.head.appendChild(style)
}

function TodoListEditor({ items, onChange, theme }: { items: TodoItem[]; onChange: (items: TodoItem[]) => void; theme: Theme }) {
  const add = () => onChange([...items, { id: crypto.randomUUID(), text: '', url: '' }])
  const update = (id: string, field: keyof TodoItem, value: string) =>
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  const remove = (id: string) => onChange(items.filter(i => i.id !== id))

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="p-3 rounded-lg border border-gray-200 space-y-2">
          <div className="flex gap-2">
            <input className="input flex-1" value={item.text} onChange={e => update(item.id, 'text', e.target.value)} placeholder="Action item…" />
            <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
          <input className="input" value={item.url || ''} onChange={e => update(item.id, 'url', e.target.value)} placeholder="Link URL (optional)" />
        </div>
      ))}
      <AddButton onClick={add} label="Add Item" color={theme.primaryColor} />
    </div>
  )
}

function BirthdaysEditor({ birthdays, onChange, theme }: { birthdays: BirthdayEntry[]; onChange: (b: BirthdayEntry[]) => void; theme: Theme }) {
  const add = () => onChange([...birthdays, { id: crypto.randomUUID(), name: '', date: '' }])
  const update = (id: string, field: keyof BirthdayEntry, value: string) =>
    onChange(birthdays.map(b => b.id === id ? { ...b, [field]: value } : b))
  const remove = (id: string) => onChange(birthdays.filter(b => b.id !== id))

  return (
    <div className="space-y-2">
      {birthdays.map(b => (
        <div key={b.id} className="flex gap-2 items-center">
          <input className="input flex-1" value={b.name} onChange={e => update(b.id, 'name', e.target.value)} placeholder="Name" />
          <input className="input w-28" value={b.date} onChange={e => update(b.id, 'date', e.target.value)} placeholder="Apr 15" />
          <button onClick={() => remove(b.id)} className="text-gray-400 hover:text-red-500 transition">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <AddButton onClick={add} label="Add Birthday" color={theme.primaryColor} />
    </div>
  )
}

function BirthAnnouncementsEditor({ announcements, onChange, theme }: { announcements: BirthAnnouncement[]; onChange: (a: BirthAnnouncement[]) => void; theme: Theme }) {
  const add = () => onChange([...announcements, { id: crypto.randomUUID(), familyName: '', babyName: '', birthday: '', mealTrainUrl: '' }])
  const update = (id: string, field: keyof BirthAnnouncement, value: string) =>
    onChange(announcements.map(a => a.id === id ? { ...a, [field]: value } : a))
  const remove = (id: string) => onChange(announcements.filter(a => a.id !== id))

  return (
    <div className="space-y-3">
      {announcements.map(a => (
        <div key={a.id} className="p-3 rounded-lg border border-gray-200 space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-500">Announcement</span>
            <button onClick={() => remove(a.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <input className="input" value={a.babyName} onChange={e => update(a.id, 'babyName', e.target.value)} placeholder="Baby's name" />
          <input className="input" value={a.familyName} onChange={e => update(a.id, 'familyName', e.target.value)} placeholder="Family last name" />
          <input className="input" value={a.birthday} onChange={e => update(a.id, 'birthday', e.target.value)} placeholder="Birthday (e.g. April 4)" />
          <input className="input" value={a.mealTrainUrl || ''} onChange={e => update(a.id, 'mealTrainUrl', e.target.value)} placeholder="Meal Train link (optional)" />
        </div>
      ))}
      <AddButton onClick={add} label="Add Announcement" color={theme.primaryColor} />
    </div>
  )
}

function EventsEditor({ events, onChange, theme }: { events: UpcomingEvent[]; onChange: (e: UpcomingEvent[]) => void; theme: Theme }) {
  const add = () => onChange([...events, { id: crypto.randomUUID(), name: '', date: '', time: '', location: '', description: '', rsvpUrl: '' }])
  const update = (id: string, field: keyof UpcomingEvent, value: string) =>
    onChange(events.map(e => e.id === id ? { ...e, [field]: value } : e))
  const remove = (id: string) => onChange(events.filter(e => e.id !== id))

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div key={event.id} className="p-3 rounded-lg border border-gray-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500">Event</span>
            <button onClick={() => remove(event.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
          <input className="input" value={event.name} onChange={e => update(event.id, 'name', e.target.value)} placeholder="Event name" />
          <div className="grid grid-cols-2 gap-2">
            <input className="input" value={event.date} onChange={e => update(event.id, 'date', e.target.value)} placeholder="April 21st" />
            <input className="input" value={event.time || ''} onChange={e => update(event.id, 'time', e.target.value)} placeholder="5:30 – 7pm" />
          </div>
          <input className="input" value={event.location || ''} onChange={e => update(event.id, 'location', e.target.value)} placeholder="Location" />
          <textarea className="input" rows={2} value={event.description || ''} onChange={e => update(event.id, 'description', e.target.value)} placeholder="Description (optional)" />
          <input className="input" value={event.rsvpUrl || ''} onChange={e => update(event.id, 'rsvpUrl', e.target.value)} placeholder="RSVP link (optional)" />
        </div>
      ))}
      <AddButton onClick={add} label="Add Event" color={theme.primaryColor} />
    </div>
  )
}

function SemesterDatesEditor({ dates, onChange, theme }: { dates: SemesterDate[]; onChange: (d: SemesterDate[]) => void; theme: Theme }) {
  const add = () => onChange([...dates, { id: crypto.randomUUID(), label: '', date: '' }])
  const update = (id: string, field: keyof SemesterDate, value: string) =>
    onChange(dates.map(d => d.id === id ? { ...d, [field]: value } : d))
  const remove = (id: string) => onChange(dates.filter(d => d.id !== id))

  return (
    <div className="space-y-2">
      {dates.map(d => (
        <div key={d.id} className="flex gap-2 items-center">
          <input className="input w-28" value={d.date} onChange={e => update(d.id, 'date', e.target.value)} placeholder="Apr 21" />
          <input className="input flex-1" value={d.label} onChange={e => update(d.id, 'label', e.target.value)} placeholder="EC Farewell" />
          <button onClick={() => remove(d.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
        </div>
      ))}
      <AddButton onClick={add} label="Add Date" color={theme.primaryColor} />
    </div>
  )
}

function AddButton({ onClick, label, color }: { onClick: () => void; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border-2 border-dashed transition w-full justify-center hover:opacity-80"
      style={{ borderColor: color, color }}
    >
      <Plus size={13} />
      {label}
    </button>
  )
}
