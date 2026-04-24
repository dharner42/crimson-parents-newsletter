import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Newsletter, NewsletterSection, SectionType } from '../types'
import { THEMES, SECTION_LABELS } from '../themes'
import { exportToPDF } from '../lib/pdfExport'
import NewsletterPreview from '../components/NewsletterPreview'
import SectionEditor from '../components/SectionEditor'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Download, Save, Plus, GripVertical,
  Trash2, Palette, Check
} from 'lucide-react'

const ALL_SECTION_TYPES: SectionType[] = [
  'header','presidentMessage','todoList','birthdays','birthAnnouncements',
  'upcomingEvents','playgroups','semesterDates','clubSponsor'
]

const DEFAULT_SECTION_DATA: Record<SectionType, object> = {
  header: { clubName: 'Crimson Parents Club', tagline: 'Harvard Business School', newsletterDate: '' },
  presidentMessage: { presidentName: '', message: '' },
  todoList: { items: [] },
  birthdays: { birthdays: [] },
  birthAnnouncements: { announcements: [] },
  upcomingEvents: { events: [] },
  playgroups: { playgroupsText: '', playgroupsLink: '', playgroupsLinkLabel: '' },
  semesterDates: { dates: [] },
  clubSponsor: { sponsorName: '', sponsorLink: '', sponsorDescription: '' },
}

interface Props { user: User }

export default function Editor({ user }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [sections, setSections] = useState<NewsletterSection[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [theme, setTheme] = useState('default')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [dirty, setDirty] = useState(false)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!id) return
    supabase.from('newsletters').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error || !data) { toast.error('Newsletter not found'); navigate('/'); return }
      const n = data as Newsletter
      setNewsletter(n)
      setTitle(n.title)
      setTheme(n.theme)
      setSections(n.content?.sections || [])
    })
  }, [id])

  // Auto-save
  const save = useCallback(async (sectionsToSave?: NewsletterSection[], silent = false) => {
    if (!id) return
    setSaving(true)
    const s = sectionsToSave || sections
    const { error } = await supabase.from('newsletters').update({
      title,
      theme,
      updated_at: new Date().toISOString(),
      content: { sections: s },
    }).eq('id', id)

    if (error) {
      if (!silent) toast.error('Failed to save')
    } else {
      setDirty(false)
      if (!silent) toast.success('Saved!')
    }
    setSaving(false)
  }, [id, title, theme, sections])

  useEffect(() => {
    if (!dirty) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => save(undefined, true), 30000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [dirty, save])

  const updateSectionData = (sectionId: string, data: object) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, data: { ...s.data, ...data } } : s))
    setDirty(true)
  }

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId))
    if (activeSection === sectionId) setActiveSection(null)
    setDirty(true)
  }

  const addSection = (type: SectionType) => {
    const newSection: NewsletterSection = {
      id: crypto.randomUUID(),
      type,
      data: { ...DEFAULT_SECTION_DATA[type] },
    }
    setSections(prev => [...prev, newSection])
    setActiveSection(newSection.id)
    setShowAddSection(false)
    setDirty(true)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reordered = Array.from(sections)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setSections(reordered)
    setDirty(true)
  }

  const handleExport = async () => {
    setExporting(true)
    await save(undefined, true)
    try {
      await exportToPDF('newsletter-preview-content', title || 'newsletter')
    } catch {
      toast.error('Export failed. Try again.')
    }
    setExporting(false)
  }

  const currentTheme = THEMES[theme] || THEMES.default
  const activeSectionObj = sections.find(s => s.id === activeSection)

  if (!newsletter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-crimson-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm">
        {/* Top */}
        <div className="p-4 border-b border-gray-100">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-4 transition">
            <ArrowLeft size={16} /> Back
          </button>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setDirty(true) }}
            className="w-full text-sm font-bold text-gray-800 border-none outline-none bg-transparent truncate"
            placeholder="Newsletter title…"
          />
          <p className="text-xs text-gray-400 mt-0.5">{currentTheme.emoji} {currentTheme.name}</p>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sections</p>
            <button onClick={() => setShowAddSection(!showAddSection)} className="text-xs text-crimson-600 hover:text-crimson-800 font-semibold flex items-center gap-1">
              <Plus size={13} /> Add
            </button>
          </div>

          {/* Add Section Dropdown */}
          {showAddSection && (
            <div className="mb-3 bg-gray-50 rounded-lg p-2 border border-gray-200">
              {ALL_SECTION_TYPES.filter(t => !sections.find(s => s.type === t)).map(type => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white rounded text-gray-700 hover:text-gray-900 transition"
                >
                  {SECTION_LABELS[type]}
                </button>
              ))}
              {ALL_SECTION_TYPES.every(t => sections.find(s => s.type === t)) && (
                <p className="text-xs text-gray-400 text-center py-2">All sections added</p>
              )}
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                  {sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() => setActiveSection(section.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm group
                            ${activeSection === section.id
                              ? 'text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                            ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          style={activeSection === section.id ? { background: currentTheme.primaryColor } : {}}
                        >
                          <span {...provided.dragHandleProps} className="text-current opacity-40 cursor-grab flex-shrink-0">
                            <GripVertical size={14} />
                          </span>
                          <span className="flex-1 truncate text-xs font-medium">
                            {SECTION_LABELS[section.type]}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); deleteSection(section.id) }}
                            className="opacity-0 group-hover:opacity-100 transition flex-shrink-0 hover:text-red-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {sections.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No sections yet — add one above</p>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {/* Theme */}
          <div>
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              <Palette size={16} />
              <span className="flex-1 text-left">Theme: {currentTheme.name}</span>
            </button>
            {showThemePicker && (
              <div className="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-2 gap-1">
                {Object.values(THEMES).map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setShowThemePicker(false); setDirty(true) }}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-white transition text-left"
                  >
                    <span>{t.emoji}</span>
                    <span className="flex-1 truncate">{t.name}</span>
                    {theme === t.id && <Check size={12} className="text-green-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={() => save()}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50"
            style={{ background: currentTheme.primaryColor }}
          >
            <Save size={15} />
            {saving ? 'Saving…' : dirty ? 'Save Changes' : 'Saved ✓'}
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 transition disabled:opacity-50"
            style={{ borderColor: currentTheme.primaryColor, color: currentTheme.primaryColor }}
          >
            <Download size={15} />
            {exporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </aside>

      {/* Main Preview */}
      <main className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div>
          <NewsletterPreview
            sections={sections}
            theme={currentTheme}
            previewId="newsletter-preview-content"
          />
        </div>
      </main>

      {/* Right Editor Panel */}
      {activeSectionObj && (
        <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">{SECTION_LABELS[activeSectionObj.type]}</h3>
            <button onClick={() => setActiveSection(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
          </div>
          <div className="p-4">
            <SectionEditor
              section={activeSectionObj}
              onChange={data => updateSectionData(activeSectionObj.id, data)}
              theme={currentTheme}
              user={user}
              newsletterId={newsletter.id}
            />
          </div>
        </aside>
      )}
    </div>
  )
}
