import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Newsletter } from '../types'
import { THEMES } from '../themes'
import toast from 'react-hot-toast'
import { PlusCircle, FileText, Trash2, LogOut, Edit3 } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

interface Props {
  user: User
}

export default function Dashboard({ user }: Props) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const fetchNewsletters = async () => {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load newsletters')
    } else {
      setNewsletters(data as Newsletter[])
    }
    setLoading(false)
  }

  const createNewsletter = async () => {
    setCreating(true)
    const now = new Date()
    const title = `${MONTHS[now.getMonth()]} ${now.getFullYear()} Newsletter`

    const defaultContent = {
      sections: [
        {
          id: crypto.randomUUID(),
          type: 'header',
          data: {
            clubName: 'Crimson Parents Club',
            tagline: 'Harvard Business School',
            newsletterDate: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
          },
        },
        {
          id: crypto.randomUUID(),
          type: 'presidentMessage',
          data: {
            presidentName: 'Claire',
            message: 'Hello Crimson Parents! We hope you\'re having a wonderful week.',
          },
        },
        {
          id: crypto.randomUUID(),
          type: 'upcomingEvents',
          data: { events: [] },
        },
      ],
    }

    const { data, error } = await supabase
      .from('newsletters')
      .insert({
        title,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        theme: 'default',
        status: 'draft',
        created_by: user.id,
        content: defaultContent,
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to create newsletter')
    } else {
      navigate(`/editor/${data.id}`)
    }
    setCreating(false)
  }

  const deleteNewsletter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this newsletter? This cannot be undone.')) return

    const { error } = await supabase.from('newsletters').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete')
    } else {
      setNewsletters(prev => prev.filter(n => n.id !== id))
      toast.success('Deleted')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #A51C30 0%, #6d1020 100%)' }} className="shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="font-heading text-xl font-bold text-white tracking-wide">Crimson Parents</h1>
              <p className="text-xs text-red-200 tracking-widest uppercase">Newsletter Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-red-200 text-sm hidden sm:block">{user.email}</span>
            <button onClick={signOut} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition">
              <LogOut size={16} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-900">Newsletters</h2>
            <p className="text-gray-500 text-sm mt-1">Create and manage your monthly newsletters</p>
          </div>
          <button
            onClick={createNewsletter}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #A51C30 0%, #6d1020 100%)' }}
          >
            <PlusCircle size={18} />
            {creating ? 'Creating…' : 'New Newsletter'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-crimson-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-heading text-xl text-gray-600 mb-2">No newsletters yet</h3>
            <p className="text-gray-400 text-sm mb-6">Create your first newsletter to get started</p>
            <button
              onClick={createNewsletter}
              disabled={creating}
              className="px-6 py-2.5 text-white rounded-lg font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #A51C30 0%, #6d1020 100%)' }}
            >
              Create Newsletter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsletters.map(newsletter => {
              const theme = THEMES[newsletter.theme] || THEMES.default
              return (
                <div
                  key={newsletter.id}
                  onClick={() => navigate(`/editor/${newsletter.id}`)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
                >
                  {/* Color bar */}
                  <div className="h-2 w-full" style={{ background: theme.headerBg }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-xl mr-2">{theme.emoji}</span>
                        <span className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                              style={{ background: theme.sectionHeaderBg, color: theme.sectionHeaderText }}>
                          {theme.name}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        newsletter.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {newsletter.status}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-gray-900 text-lg leading-tight mb-1">{newsletter.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Updated {new Date(newsletter.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/editor/${newsletter.id}`) }}
                        className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                        style={{ color: theme.primaryColor }}
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={e => deleteNewsletter(newsletter.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
