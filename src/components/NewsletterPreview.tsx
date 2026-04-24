import type { NewsletterSection, Theme } from '../types'
import { ExternalLink } from 'lucide-react'

interface Props {
  sections: NewsletterSection[]
  theme: Theme
  previewId: string
}

export default function NewsletterPreview({ sections, theme, previewId }: Props) {
  const bodyStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.bodyText,
  }

  const sectionHeaderStyle = {
    backgroundColor: theme.sectionHeaderBg,
    color: theme.sectionHeaderText,
    borderBottom: `2px solid ${theme.sectionBorderColor}`,
  }

  const sectionBodyStyle = {
    borderColor: theme.sectionBorderColor + '30',
    backgroundColor: theme.backgroundColor,
  }

  const accentStyle = { color: theme.primaryColor }
  const accentBg = { backgroundColor: theme.primaryColor + '15' }

  return (
    <div
      id={previewId}
      className="newsletter-preview"
      style={bodyStyle}
    >
      {sections.map(section => {
        switch (section.type) {
          case 'header':
            return (
              <div key={section.id} className="newsletter-header" style={{ background: theme.headerBg, color: theme.headerText }}>
                {section.data.bannerPhotoUrl && (
                  <img src={section.data.bannerPhotoUrl} alt="Banner" className="w-full object-cover mb-4" style={{ maxHeight: 180, borderRadius: 4 }} />
                )}
                <div className="divider-ornament" style={{ color: theme.headerText }}>
                  <span style={{ fontSize: 18 }}>✦</span>
                </div>
                <p className="club-name" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {section.data.clubName || 'Crimson Parents Club'}
                </p>
                {section.data.tagline && (
                  <p className="tagline">{section.data.tagline}</p>
                )}
                {section.data.newsletterDate && (
                  <p className="issue-date" style={{ marginTop: 8 }}>{section.data.newsletterDate}</p>
                )}
                <div className="divider-ornament" style={{ color: theme.headerText }}>
                  <span style={{ fontSize: 18 }}>✦</span>
                </div>
              </div>
            )

          case 'presidentMessage':
            return (
              <div key={section.id} className="newsletter-body" style={{ paddingTop: 32 }}>
                <div className="newsletter-section">
                  <div className="newsletter-section-header" style={sectionHeaderStyle}>
                    <span>💌</span>
                    <h2>President's Message</h2>
                  </div>
                  <div className="newsletter-section-body president-message" style={sectionBodyStyle}>
                    {section.data.presidentName && (
                      <p style={{ fontSize: 13, color: theme.primaryColor, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>
                        FROM {section.data.presidentName.toUpperCase()}
                      </p>
                    )}
                    <p style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {section.data.message || 'Your message here…'}
                    </p>
                  </div>
                </div>
              </div>
            )

          case 'todoList':
            return (
              <SectionWrap key={section.id} icon="✅" title="To-Do List" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                {(section.data.items || []).length === 0 ? (
                  <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>No items yet</p>
                ) : (
                  <div>
                    {(section.data.items || []).map((item: { id: string; text: string; url?: string }, i: number) => (
                      <div key={item.id} className="todo-item">
                        <div className="todo-bullet" style={{ backgroundColor: theme.primaryColor, color: 'white' }}>{i + 1}</div>
                        <span style={{ flex: 1 }}>
                          {item.url ? (
                            <a href={item.url} style={{ color: theme.primaryColor, textDecoration: 'underline' }}>
                              {item.text}
                            </a>
                          ) : item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionWrap>
            )

          case 'birthdays':
            return (
              <SectionWrap key={section.id} icon="🎂" title="Birthdays" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                {(section.data.birthdays || []).length === 0 ? (
                  <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>No birthdays this month</p>
                ) : (
                  <div className="birthday-grid">
                    {(section.data.birthdays || []).map((b: { id: string; name: string; date: string }) => (
                      <div key={b.id} className="birthday-item" style={accentBg}>
                        <span style={{ fontSize: 18 }}>🎉</span>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{b.name}</p>
                          <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>{b.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionWrap>
            )

          case 'birthAnnouncements':
            return (
              <SectionWrap key={section.id} icon="👶" title="Birth Announcements" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                {(section.data.announcements || []).length === 0 ? (
                  <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>No announcements yet</p>
                ) : (
                  (section.data.announcements || []).map((a: { id: string; familyName: string; babyName: string; birthday: string; mealTrainUrl?: string }) => (
                    <div key={a.id} className="birth-card" style={{ borderColor: theme.sectionBorderColor + '40', backgroundColor: theme.sectionHeaderBg }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 24 }}>🍼</span>
                        <div>
                          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, margin: 0, color: theme.primaryColor }}>
                            {a.babyName}
                          </p>
                          <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>
                            The {a.familyName} Family · Born {a.birthday}
                          </p>
                        </div>
                      </div>
                      {a.mealTrainUrl && (
                        <a href={a.mealTrainUrl} style={{ fontSize: 12, color: theme.primaryColor, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ExternalLink size={11} /> Meal Train
                        </a>
                      )}
                    </div>
                  ))
                )}
              </SectionWrap>
            )

          case 'upcomingEvents':
            return (
              <SectionWrap key={section.id} icon="📅" title="Upcoming Events" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                {(section.data.events || []).length === 0 ? (
                  <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>No events yet</p>
                ) : (
                  (section.data.events || []).map((event: { id: string; name: string; date: string; time?: string; location?: string; description?: string; rsvpUrl?: string }) => (
                    <div key={event.id} className="event-card" style={{ borderLeftColor: theme.primaryColor, backgroundColor: theme.sectionHeaderBg }}>
                      <p className="event-name" style={{ fontFamily: '"Playfair Display", serif', color: theme.bodyText }}>{event.name}</p>
                      <p className="event-meta" style={{ color: theme.primaryColor }}>
                        {[event.date, event.time, event.location].filter(Boolean).join(' · ')}
                      </p>
                      {event.description && (
                        <p className="event-description" style={{ color: theme.bodyText }}>{event.description}</p>
                      )}
                      {event.rsvpUrl && (
                        <a href={event.rsvpUrl} style={{ fontSize: 12, color: theme.primaryColor, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                          <ExternalLink size={11} /> RSVP
                        </a>
                      )}
                    </div>
                  ))
                )}
              </SectionWrap>
            )

          case 'playgroups':
            return (
              <SectionWrap key={section.id} icon="🧸" title="Playgroups" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {section.data.playgroupsText || 'Playgroup details here…'}
                </p>
                {section.data.playgroupsLink && (
                  <a href={section.data.playgroupsLink} style={{ fontSize: 13, color: theme.primaryColor, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                    <ExternalLink size={12} />
                    {section.data.playgroupsLinkLabel || 'Learn More'}
                  </a>
                )}
              </SectionWrap>
            )

          case 'semesterDates':
            return (
              <SectionWrap key={section.id} icon="🗓️" title="Semester Dates" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                {(section.data.dates || []).length === 0 ? (
                  <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>No dates yet</p>
                ) : (
                  <div className="semester-dates-grid">
                    {(section.data.dates || []).map((d: { id: string; label: string; date: string }) => (
                      <>
                        <span key={`${d.id}-date`} className="semester-date-label" style={accentStyle}>{d.date}</span>
                        <span key={`${d.id}-label`}>{d.label}</span>
                      </>
                    ))}
                  </div>
                )}
              </SectionWrap>
            )

          case 'clubSponsor':
            return (
              <SectionWrap key={section.id} icon="⭐" title="Thank You to Our Sponsor" headerStyle={sectionHeaderStyle} bodyStyle={sectionBodyStyle}>
                <div className="sponsor-area">
                  {section.data.sponsorLogoUrl && (
                    <img src={section.data.sponsorLogoUrl} alt="Sponsor logo" className="mx-auto mb-4 max-h-20 object-contain" />
                  )}
                  {section.data.sponsorName && (
                    <p className="sponsor-name" style={{ fontFamily: '"Playfair Display", serif', color: theme.primaryColor }}>
                      {section.data.sponsorName}
                    </p>
                  )}
                  {section.data.sponsorDescription && (
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: theme.bodyText }}>{section.data.sponsorDescription}</p>
                  )}
                  {section.data.sponsorLink && (
                    <a href={section.data.sponsorLink} style={{ fontSize: 13, color: theme.primaryColor, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                      <ExternalLink size={12} /> Visit Website
                    </a>
                  )}
                </div>
              </SectionWrap>
            )

          default:
            return null
        }
      })}

      {/* Footer */}
      {sections.length > 0 && (
        <div className="newsletter-footer" style={{ borderTopColor: theme.sectionBorderColor + '40', color: theme.bodyText }}>
          <p>CRIMSON PARENTS CLUB · HARVARD BUSINESS SCHOOL</p>
          <p style={{ marginTop: 4 }}>Sent via WhatsApp · {new Date().getFullYear()}</p>
        </div>
      )}
    </div>
  )
}

function SectionWrap({ children, icon, title, headerStyle, bodyStyle }: {
  children: React.ReactNode
  icon: string
  title: string
  headerStyle: React.CSSProperties
  bodyStyle: React.CSSProperties
}) {
  return (
    <div style={{ padding: '0 48px 32px' }}>
      <div className="newsletter-section">
        <div className="newsletter-section-header" style={headerStyle}>
          <span>{icon}</span>
          <h2 style={{ fontFamily: '"Playfair Display", serif' }}>{title}</h2>
        </div>
        <div className="newsletter-section-body" style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}
