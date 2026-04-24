export type SectionType =
  | 'header'
  | 'presidentMessage'
  | 'todoList'
  | 'birthdays'
  | 'birthAnnouncements'
  | 'upcomingEvents'
  | 'playgroups'
  | 'semesterDates'
  | 'clubSponsor'

export interface TodoItem {
  id: string
  text: string
  url?: string
}

export interface BirthdayEntry {
  id: string
  name: string
  date: string
}

export interface BirthAnnouncement {
  id: string
  familyName: string
  babyName: string
  birthday: string
  mealTrainUrl?: string
}

export interface UpcomingEvent {
  id: string
  name: string
  date: string
  time?: string
  location?: string
  description?: string
  rsvpUrl?: string
}

export interface SemesterDate {
  id: string
  label: string
  date: string
}

export interface SectionData {
  // header
  clubName?: string
  tagline?: string
  newsletterDate?: string
  bannerPhotoUrl?: string

  // presidentMessage
  presidentName?: string
  message?: string

  // todoList
  items?: TodoItem[]

  // birthdays
  birthdays?: BirthdayEntry[]

  // birthAnnouncements
  announcements?: BirthAnnouncement[]

  // upcomingEvents
  events?: UpcomingEvent[]

  // playgroups
  playgroupsText?: string
  playgroupsLink?: string
  playgroupsLinkLabel?: string

  // semesterDates
  dates?: SemesterDate[]

  // clubSponsor
  sponsorName?: string
  sponsorLogoUrl?: string
  sponsorLink?: string
  sponsorDescription?: string
}

export interface NewsletterSection {
  id: string
  type: SectionType
  data: SectionData
}

export interface Newsletter {
  id: string
  title: string
  month: number | null
  year: number | null
  theme: string
  status: 'draft' | 'published'
  created_by: string
  created_at: string
  updated_at: string
  content: {
    sections: NewsletterSection[]
  }
}

export interface Theme {
  id: string
  name: string
  emoji: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  headerBg: string
  headerText: string
  sectionBorderColor: string
  sectionHeaderBg: string
  sectionHeaderText: string
  bodyText: string
  decorativeClass: string
}
