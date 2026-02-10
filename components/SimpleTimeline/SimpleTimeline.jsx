import React, { memo, useCallback, useMemo, useState } from 'react'
import './SimpleTimeline.css'

const ChevronDown = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ChevronUp = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const Code = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </svg>
)

const Palette = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

const Badge = ({ children, className = '', ...props }) => (
  <span className={`st-badge ${className}`} {...props}>
    {children}
  </span>
)

export const defaultTimelineData = [
  {
    id: 'timeline-item-1',
    title: 'Senior Frontend Developer',
    type: 'Full-time',
    duration: '10.2022—Present',
    icon: Code,
    responsibilities: [
      'Lead development of complex React applications with TypeScript.',
      'Architect scalable frontend solutions using Next.js and modern tooling.',
      'Mentor junior developers and conduct code reviews.',
      'Collaborate with design and backend teams to deliver high-quality products.'
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL']
  },
  {
    id: 'timeline-item-2',
    title: 'UI Design Lead',
    type: 'Full-time',
    duration: '10.2022—Present',
    icon: Palette,
    responsibilities: [
      'Ensure UI/UX consistency and high-quality standards.',
      'Design intuitive, user-focused interfaces aligned with business goals.',
      'Define and establish a cohesive UI style for the company.'
    ],
    skills: ['Creativity', 'UI/UX Design', 'Figma']
  },
  {
    id: 'timeline-item-3',
    title: 'Frontend Developer',
    type: 'Full-time',
    duration: '03.2021—09.2022',
    icon: Code,
    responsibilities: [
      'Developed responsive web applications using React and Vue.js.',
      'Implemented pixel-perfect designs from Figma mockups.',
      'Optimized application performance and user experience.',
      'Collaborated in an agile development environment.'
    ],
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'HTML']
  }
]

const TimelineItemContent = memo(function TimelineItemContent({ item }) {
  return (
    <div className="st-content">
      <ul className="st-list">
        {item.responsibilities.map((responsibility, idx) => (
          <li key={`${item.id}-resp-${idx}`} className="st-list-item">
            <span className="st-bullet" aria-hidden="true" />
            <span className="st-list-text">{responsibility}</span>
          </li>
        ))}
      </ul>

      <div className="st-skills">
        {item.skills.map((skill, skillIdx) => (
          <Badge key={`${item.id}-skill-${skillIdx}`} className="st-skill-badge">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  )
})
TimelineItemContent.displayName = 'TimelineItemContent'

const TimelineItem = memo(function TimelineItem({ item, expanded, onToggle }) {
  const Icon = item.icon
  const headerId = `timeline-header-${item.id}`
  const contentId = `timeline-content-${item.id}`

  return (
    <li className="st-item">
      <div className="st-dot">
        <Icon className="st-dot-icon" />
      </div>

      <div className="st-item-body">
        <div className="st-card">
          <button
            id={headerId}
            type="button"
            className="st-header-btn"
            onClick={() => onToggle(item.id)}
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            <div className="st-header-row">
              <div className="st-header-left">
                <h3 className="st-title">{item.title}</h3>
                <div className="st-meta">
                  <span>{item.type}</span>
                  <span aria-hidden="true">•</span>
                  <span>{item.duration}</span>
                </div>
              </div>
              <div className="st-chevron" aria-hidden="true">
                {expanded ? <ChevronUp className="st-chevron-icon" /> : <ChevronDown className="st-chevron-icon" />}
              </div>
            </div>
          </button>

          {expanded && (
            <div id={contentId} role="region" aria-labelledby={headerId}>
              <TimelineItemContent item={item} />
            </div>
          )}
        </div>
      </div>
    </li>
  )
})
TimelineItem.displayName = 'TimelineItem'

export function ProfessionalTimeline({ data, defaultExpandedIds, expandMode = 'multi' }) {
  const initial = useMemo(() => defaultExpandedIds ?? data.map((d) => d.id), [defaultExpandedIds, data])
  const [expanded, setExpanded] = useState(() => new Set(initial))

  const onToggle = useCallback(
    (id) => {
      setExpanded((prev) => {
        if (expandMode === 'single') {
          return prev.has(id) ? new Set() : new Set([id])
        }
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    },
    [expandMode]
  )

  return (
    <ol className="st-timeline">
      <div className="st-line" aria-hidden="true" />
      {data.map((item) => (
        <TimelineItem key={item.id} item={item} expanded={expanded.has(item.id)} onToggle={onToggle} />
      ))}
    </ol>
  )
}

export default function SimpleTimeline({
  title = 'Professional Experience',
  data = defaultTimelineData,
  defaultExpandedIds,
  expandMode = 'multi'
}) {
  return (
    <div className="st-shell">
      <header className="st-page-header">
        <h2 className="st-page-title">{title}</h2>
      </header>
      <ProfessionalTimeline data={data} defaultExpandedIds={defaultExpandedIds} expandMode={expandMode} />
    </div>
  )
}


