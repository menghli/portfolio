import { useState, useEffect, useRef, Children, isValidElement, cloneElement } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './DesignPage.css'

const _designImgModules = import.meta.glob('../img/design/*.svg', { eager: true })
const DESIGN_IMG = Object.fromEntries(
  Object.entries(_designImgModules).map(([path, mod]) => [path.split('/').pop(), mod.default])
)
function resolveImgSrc(src) {
  const basename = src?.split('/').pop()
  return (basename && DESIGN_IMG[basename]) || src
}

const COVER_IMAGES = {
  'pin-mi':  DESIGN_IMG['Pin-MI-page-cover.svg'],
  'dubjam':  DESIGN_IMG['Dubjam-page-cover.svg'],
  'dory-vr': DESIGN_IMG['DoryVR-page-cover.svg'],
}

const LOADERS = {
  'pin-mi':  () => import('../content/design/pin-mi.md?raw'),
  'dubjam':  () => import('../content/design/dubjam.md?raw'),
  'dory-vr': () => import('../content/design/dory-vr.md?raw'),
}

const NAV_ITEMS = [
  { id: 'overview',    label: 'OVERVIEW' },
  { id: 'solution',    label: 'SOLUTION PREVIEW' },
  { id: 'research',    label: 'RESEARCH' },
  { id: 'exploration', label: 'EXPLORATION' },
  { id: 'design',      label: 'DESIGN' },
  { id: 'outcome',     label: 'OUTCOME' },
  { id: 'reflections', label: 'REFLECTIONS' },
]

const SECTION_MAP = {
  overview:    ['Project Overview'],
  solution:    ['Solution Preview', 'Solution Overview', 'Solution'],
  research:    ['Research', 'Initial Research', 'How Might We'],
  exploration: ['Exploration', 'Iteration 1', 'User Testing',
                'Defining the Experience and Ideation', 'Design System',
                'Challenges We Faced During the Process'],
  design:      ['Design', 'Final Iteration', 'Final Solution'],
  outcome:     ['Outcomes', 'Outcome'],
  reflections: ['My Learnings', 'Reflections'],
}

const NEXT_SLUG = {
  'pin-mi':  '/design/dubjam',
  'dubjam':  '/design/dory-vr',
  'dory-vr': '/design/pin-mi',
}

// ── Markdown parsing (identical to ResearchPage) ─────────────────────────
function parseMarkdown(raw) {
  const lines = raw.split('\n')
  let title = '', subtitle = '', eyebrow = '', cover = ''
  let h1Count = 0
  const sections = {}
  let currentSection = null
  let currentLines = []

  for (const line of lines) {
    if (line.startsWith('# ')) {
      h1Count++
      if (h1Count === 2) title = line.slice(2).trim()
      continue
    }
    if (line.startsWith('Subtitle:')) { subtitle = line.replace('Subtitle:', '').trim(); continue }
    if (line.startsWith('Eyebrow:'))  { eyebrow  = line.replace('Eyebrow:', '').trim();  continue }
    if (line.startsWith('Cover:'))    { cover    = line.replace('Cover:', '').trim();    continue }
    if (line.startsWith('Status:') || line.startsWith('tag:')) continue

    if (line.startsWith('## ')) {
      if (currentSection !== null) {
        sections[currentSection] = currentLines.join('\n').trim()
      }
      currentSection = line.slice(3).trim()
      currentLines = []
    } else if (currentSection !== null) {
      currentLines.push(line)
    }
  }
  if (currentSection !== null) sections[currentSection] = currentLines.join('\n').trim()

  return { title, subtitle, eyebrow, cover, sections }
}

function parseMetaTable(text = '') {
  const result = {}
  for (const line of text.split('\n')) {
    const match = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/)
    if (match && match[1] !== 'Field' && !match[1].startsWith('-')) {
      result[match[1]] = match[2]
    }
  }
  return result
}

function getSectionContent(navId, sections) {
  return (SECTION_MAP[navId] || [])
    .map(k => sections[k] || '')
    .filter(Boolean)
    .join('\n\n')
}

function clean(text) {
  return text
    .replace(/\[📎[^\]]*\]/g, '')
    .replace(/📋[^\n]*\n/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ── Block parser: splits text on :::directive blocks ─────────────────────
function parseBlocks(text) {
  const blocks = []
  const re = /(:::[\w-]+[^\n]*\n[\s\S]*?\n:::)/g
  let lastIndex = 0
  let match

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index).trim()
      if (textContent) blocks.push({ type: 'md', content: textContent })
    }
    const inner = match[0]
    const typeMatch = inner.match(/^:::([\w-]+)([^\n]*)\n([\s\S]*)\n:::$/)
    if (typeMatch) {
      blocks.push({
        type: typeMatch[1].toLowerCase(),
        label: typeMatch[2].trim(),
        content: typeMatch[3].trim(),
      })
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim()
    if (remaining) blocks.push({ type: 'md', content: remaining })
  }

  return blocks
}

// ── Highlight sweep: processes ==phrase== markers ─────────────────────────
function processHighlights(children) {
  const result = []
  Children.forEach(children, (child, i) => {
    if (typeof child === 'string' && child.includes('==')) {
      child.split(/(==.+?==)/g).forEach((part, j) => {
        const m = part.match(/^==(.+?)==$/)
        result.push(m
          ? <mark key={`${i}-${j}`} className="dp-highlight">{m[1]}</mark>
          : part
        )
      })
    } else if (isValidElement(child) && child.props?.children != null) {
      result.push(cloneElement(child, { key: child.key ?? i }, processHighlights(child.props.children)))
    } else {
      result.push(child)
    }
  })
  return result
}

// ── Article image components ───────────────────────────────────────────────
function ArticleImageOneColumn({ src, alt }) {
  return (
    <div className="dp-img-one-col">
      <img src={resolveImgSrc(src)} alt={alt || ''} className="dp-img" />
      {alt && <p className="dp-img-caption">{alt}</p>}
    </div>
  )
}

function ArticleImageTwoColumn({ leftSrc, leftAlt, rightSrc, rightAlt }) {
  return (
    <div className="dp-img-two-col">
      <div className="dp-img-col">
        <img src={resolveImgSrc(leftSrc)} alt={leftAlt || ''} className="dp-img" />
        {leftAlt && <p className="dp-img-caption">{leftAlt}</p>}
      </div>
      <div className="dp-img-col">
        <img src={resolveImgSrc(rightSrc)} alt={rightAlt || ''} className="dp-img" />
        {rightAlt && <p className="dp-img-caption">{rightAlt}</p>}
      </div>
    </div>
  )
}

// ── ReactMarkdown components ──────────────────────────────────────────────
const mdComponents = {
  h1: () => null,
  h2: () => null,
  hr: () => null,
  h3: ({ children }) => <h3 className="dp-h3">{processHighlights(children)}</h3>,
  p: ({ children }) => {
    const arr = Children.toArray(children)

    if (arr.length === 1 && typeof arr[0] === 'string') {
      const match = arr[0].match(/^\[linkedin-button(?::(.+))?\]$/)
      if (match) {
        const label = match[1] || 'Connect with me on LinkedIn'
        return (
          <div className="dp-inline-action">
            <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer" className="pill ghost">
              {label}
            </a>
          </div>
        )
      }
    }

    const nodes = arr.filter(c => !(typeof c === 'string' && !c.trim()))
    const imgs = nodes.filter(el => isValidElement(el) && el.type === 'img')
    if (imgs.length > 0 && imgs.length === nodes.length) {
      if (imgs.length === 1) {
        const { src, alt } = imgs[0].props
        return <ArticleImageOneColumn src={src} alt={alt} />
      }
      if (imgs.length === 2) {
        const [l, r] = imgs
        return <ArticleImageTwoColumn
          leftSrc={l.props.src}  leftAlt={l.props.alt}
          rightSrc={r.props.src} rightAlt={r.props.alt}
        />
      }
    }

    return <p className="dp-para">{processHighlights(children)}</p>
  },
  blockquote: ({ children }) => (
    <blockquote className="dp-pullquote">{children}</blockquote>
  ),
  ul: ({ children }) => <ul className="dp-list">{children}</ul>,
  ol: ({ children }) => <ol className="dp-list dp-list--ol">{children}</ol>,
  li: ({ children }) => <li className="dp-list-item">{processHighlights(children)}</li>,
  strong: ({ children }) => <strong className="dp-strong">{children}</strong>,
  table: ({ children }) => <table className="dp-table">{children}</table>,
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="dp-table-th">{children}</th>,
  td: ({ children }) => <td className="dp-table-td">{processHighlights(children)}</td>,
}

// ── Before / After image toggle ───────────────────────────────────────────
function ImageToggle({ previousSrc, newSrc, previousLabel, newLabel }) {
  const [active, setActive] = useState('previous')
  const label = active === 'previous' ? previousLabel : newLabel
  return (
    <div className="dp-img-toggle">
      <div className="dp-img-toggle-controls" role="group" aria-label="Toggle design version">
        <div className={`dp-img-toggle-indicator${active === 'new' ? ' is-right' : ''}`} aria-hidden="true" />
        <button
          className={`dp-img-toggle-btn${active === 'previous' ? ' is-active' : ''}`}
          onClick={() => setActive('previous')}
          aria-pressed={active === 'previous'}
        >
          Previous
        </button>
        <button
          className={`dp-img-toggle-btn${active === 'new' ? ' is-active' : ''}`}
          onClick={() => setActive('new')}
          aria-pressed={active === 'new'}
        >
          New
        </button>
      </div>
      <div className="dp-img-toggle-box">
        <div className="dp-img-toggle-frame">
          <img
            src={resolveImgSrc(previousSrc)}
            alt="Previous design"
            className={`dp-img-toggle-img${active === 'previous' ? ' is-active' : ''}`}
          />
          <img
            src={resolveImgSrc(newSrc)}
            alt="New design"
            className={`dp-img-toggle-img${active === 'new' ? ' is-active' : ''}`}
          />
        </div>
        {label && <p className="dp-img-toggle-caption">{label}</p>}
      </div>
    </div>
  )
}

// ── Image gallery ──────────────────────────────────────────────────────────
function ImageGallery({ slides }) {
  const [current, setCurrent] = useState(0)
  const count = slides.length

  function go(idx) {
    setCurrent(((idx % count) + count) % count)
  }

  return (
    <div className="dp-gallery">
      <div className="dp-img-toggle-box">
        <div className="dp-gallery-frame">
          {slides.map((slide, i) => (
            <img
              key={i}
              src={resolveImgSrc(slide.src)}
              alt={slide.label || `Slide ${i + 1}`}
              className={`dp-gallery-img${i === current ? ' is-active' : ''}`}
            />
          ))}
        </div>
        {slides[current]?.label && (
          <p className="dp-img-toggle-caption">{slides[current].label}</p>
        )}
        <div className="dp-gallery-nav">
          <button className="dp-gallery-arrow" onClick={() => go(current - 1)} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="dp-gallery-dots" role="group" aria-label="Gallery navigation">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`dp-gallery-dot${i === current ? ' is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                aria-pressed={i === current}
              />
            ))}
          </div>
          <button className="dp-gallery-arrow" onClick={() => go(current + 1)} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Section block renderer ─────────────────────────────────────────────────
function SectionBlocks({ content }) {
  return parseBlocks(content).map((block, bi) => {
    if (block.type === 'md') {
      return <ReactMarkdown key={bi} components={mdComponents}>{block.content}</ReactMarkdown>
    }

    if (block.type === 'two-col') {
      const imgLines = block.content.split('\n').filter(l => l.trim().startsWith('!'))
      const imgs = imgLines.map(l => {
        const m = l.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        return m ? { alt: m[1], src: m[2] } : null
      }).filter(Boolean)
      if (imgs.length === 2) {
        return (
          <ArticleImageTwoColumn key={bi}
            leftSrc={imgs[0].src}  leftAlt={imgs[0].alt}
            rightSrc={imgs[1].src} rightAlt={imgs[1].alt}
          />
        )
      }
      return <ReactMarkdown key={bi} components={mdComponents}>{block.content}</ReactMarkdown>
    }

    if (block.type === 'callout') {
      return (
        <div key={bi} className="dp-callout">
          {block.label && <span className="dp-callout-label">{block.label}</span>}
          <ReactMarkdown components={mdComponents}>{block.content}</ReactMarkdown>
        </div>
      )
    }

    if (block.type === 'metrics') {
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const parts = line.split('·')
        return { value: parts[0].trim(), label: parts.slice(1).join('·').trim() }
      })
      return (
        <div key={bi} className="dp-metrics">
          {items.map((item, i) => (
            <div key={i} className="dp-metric-item">
              <span className="dp-metric-value">{item.value}</span>
              <span className="dp-metric-label">{item.label}</span>
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'findings') {
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const pipeIdx = line.indexOf('|')
        return pipeIdx > -1
          ? { label: line.slice(0, pipeIdx).trim(), text: line.slice(pipeIdx + 1).trim() }
          : { label: '', text: line.trim() }
      })
      return (
        <div key={bi} className="dp-findings">
          {items.map((item, i) => (
            <div key={i} className="dp-finding" style={{ '--i': i }}>
              <div className="dp-finding-meta">
                <span className="dp-finding-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="dp-finding-label">{item.label}</span>
              </div>
              <p className="dp-finding-text">{item.text}</p>
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'compare') {
      const parts = block.content.split(/\n---\n/)
      const [beforeLabel, afterLabel] = (block.label || 'Before | After').split('|').map(s => s.trim())
      return (
        <div key={bi} className="dp-compare">
          <div className="dp-compare-col">
            <span className="dp-compare-label">{beforeLabel}</span>
            <ReactMarkdown components={mdComponents}>{(parts[0] || '').trim()}</ReactMarkdown>
          </div>
          <div className="dp-compare-col">
            <span className="dp-compare-label dp-compare-label--after">{afterLabel}</span>
            <ReactMarkdown components={mdComponents}>{(parts[1] || '').trim()}</ReactMarkdown>
          </div>
        </div>
      )
    }

    if (block.type === 'gallery') {
      const slides = block.content.split('\n').filter(Boolean).map(line => {
        const idx = line.indexOf('|')
        if (idx === -1) return { src: line.trim(), label: '' }
        return { src: line.slice(0, idx).trim(), label: line.slice(idx + 1).trim() }
      })
      return <ImageGallery key={bi} slides={slides} />
    }

    if (block.type === 'before-after') {
      const lines = block.content.split('\n')
      let previousSrc = '', newSrc = '', previousLabel = '', newLabel = ''
      for (const line of lines) {
        if (line.startsWith('Previous:')) previousSrc = line.slice(9).trim()
        if (line.startsWith('New:')) newSrc = line.slice(4).trim()
        if (line.startsWith('PreviousLabel:')) previousLabel = line.slice(14).trim()
        if (line.startsWith('NewLabel:')) newLabel = line.slice(9).trim()
      }
      return <ImageToggle key={bi} previousSrc={previousSrc} newSrc={newSrc} previousLabel={previousLabel} newLabel={newLabel} />
    }

    if (block.type === 'goal') {
      const lines = block.content.split('\n')
      let hmw = '', users = '', needs = ''
      const hmwItems = []
      let mode = null

      for (const line of lines) {
        if (line.startsWith('HMW:')) {
          mode = 'hmw'
          const rest = line.slice(4).trim()
          if (rest) hmw = rest
        } else if (line.startsWith('Users:')) {
          mode = 'users'
          users = line.slice(6).trim()
        } else if (line.startsWith('Needs:')) {
          mode = 'needs'
          needs = line.slice(6).trim()
        } else if (mode === 'hmw' && line.startsWith('- ')) {
          hmwItems.push(line.slice(2).trim())
        }
      }

      const hasAnnotations = users || needs

      return (
        <div key={bi} className={`dp-goal${hasAnnotations ? '' : ' dp-goal--solo'}`}>
          <div className="dp-goal-hmw-col">
            <span className="dp-goal-kicker">How might we</span>
            <p className="dp-goal-hmw">{hmw}</p>
            {hmwItems.length > 0 && (
              <ul className="dp-goal-hmw-list">
                {hmwItems.map((item, i) => (
                  <li key={i} className="dp-goal-hmw-item">{item}</li>
                ))}
              </ul>
            )}
          </div>
          {hasAnnotations && (
            <div className="dp-goal-meta">
              {users && (
                <div className="dp-goal-meta-col">
                  <span className="dp-goal-kicker">Target Users</span>
                  <p className="dp-goal-value">{users}</p>
                </div>
              )}
              {needs && (
                <div className="dp-goal-meta-col">
                  <span className="dp-goal-kicker">Key User Needs</span>
                  <p className="dp-goal-value">{needs}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    return null
  })
}

// ── Logo SVG (shared) ──────────────────────────────────────────────────────
function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Menghan">
      <g transform="translate(4.36, 2.18)">
        <path d="M11.648 14.8189C11.4386 14.8189 11.2582 14.7258 11.1069 14.5396C10.9673 14.3535 10.8975 14.0276 10.8975 13.5622C10.8975 13.2945 10.9499 12.9804 11.0546 12.6196C11.2873 11.8865 11.5259 11.1011 11.7702 10.2633C12.0262 9.42546 12.2648 8.57018 12.4859 7.69746C12.7186 6.82473 12.9048 5.98109 13.0444 5.16655C13.184 4.34036 13.2539 3.584 13.2539 2.89745C13.2539 2.66473 13.2422 2.43782 13.2189 2.21673C13.2073 1.99564 13.1782 1.78618 13.1317 1.58836C11.9564 2.70545 10.8684 4.224 9.86767 6.144C8.87858 8.05236 7.97676 10.2749 7.16222 12.8116C7.02258 13.1956 6.84804 13.4633 6.63858 13.6145C6.42913 13.7658 6.23131 13.8415 6.04513 13.8415C5.88222 13.8415 5.72513 13.7775 5.57386 13.6495C5.42258 13.5098 5.34695 13.3004 5.34695 13.0211C5.34695 12.8349 5.39349 12.5731 5.48658 12.2356C5.57967 11.8865 5.74258 11.5665 5.97531 11.2756C6.10331 10.5076 6.20804 9.69309 6.28949 8.832C6.38258 7.97091 6.42913 7.17382 6.42913 6.44073C6.42913 6.10327 6.41167 5.78909 6.37676 5.49818C6.35349 5.19564 6.31276 4.93382 6.25458 4.71273C5.64949 5.35273 5.08513 6.15564 4.56149 7.12146C4.04949 8.07564 3.59567 9.10546 3.20004 10.2109C2.8044 11.3047 2.47276 12.3753 2.20513 13.4225C1.99567 14.1789 1.65822 14.5571 1.19276 14.5571C1.00658 14.5571 0.849491 14.4582 0.721491 14.2604C0.605127 14.0625 0.546945 13.7658 0.546945 13.3702C0.546945 12.9862 0.640036 12.4684 0.826218 11.8167C1.0124 11.1651 1.26258 10.4495 1.57676 9.66982C1.90258 8.89018 2.26331 8.11636 2.65895 7.34836C3.06622 6.56873 3.48513 5.85891 3.91567 5.21891C4.35785 4.56727 4.7884 4.04364 5.20731 3.648C5.62622 3.25236 6.0044 3.05455 6.34186 3.05455C6.56295 3.05455 6.76076 3.09527 6.93531 3.17673C7.10986 3.25818 7.26113 3.42691 7.38913 3.68291C7.51713 3.92727 7.61022 4.30546 7.6684 4.81745C7.73822 5.31782 7.77313 5.98691 7.77313 6.82473C7.77313 6.976 7.77313 7.15055 7.77313 7.34836C8.11058 6.41745 8.5004 5.51564 8.94258 4.64291C9.3964 3.75855 9.87349 2.96727 10.3739 2.26909C10.8742 1.57091 11.3746 1.01818 11.8749 0.61091C12.3753 0.203637 12.8466 0 13.2888 0C13.7891 0 14.1964 0.273455 14.5106 0.820364C14.8248 1.35564 14.9819 2.19927 14.9819 3.35127C14.9819 4.44509 14.8946 5.50982 14.72 6.54546C14.5455 7.58109 14.3244 8.55855 14.0568 9.47782C13.8008 10.3971 13.5331 11.2349 13.2539 11.9913C12.9862 12.736 12.7535 13.376 12.5557 13.9113C12.4277 14.2371 12.2939 14.4698 12.1542 14.6095C12.0146 14.7491 11.8459 14.8189 11.648 14.8189Z" fill="url(#dp-logo-m)"/>
        <circle cx="1.81819" cy="17.9695" r="1.81818" fill="url(#dp-logo-d1)"/>
        <circle cx="10.5455" cy="17.9695" r="1.81818" fill="url(#dp-logo-d2)"/>
      </g>
      <defs>
        <linearGradient id="dp-logo-m" x1="6.247" y1="3.543" x2="19.703" y2="17.389" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
        <linearGradient id="dp-logo-d1" x1="4.698" y1="18.666" x2="7.996" y2="22.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
        <linearGradient id="dp-logo-d2" x1="13.425" y1="18.666" x2="16.723" y2="22.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────
export default function DesignPage({ slug }) {
  const [parsed, setParsed] = useState({ title: '', subtitle: '', eyebrow: '', sections: {} })
  const [activeSection, setActiveSection] = useState('overview')
  const sectionRefs = useRef({})
  const contentRef  = useRef(null)
  const navRef      = useRef(null)
  const headerRef   = useRef(null)
  const heroRef     = useRef(null)
  const metaRef     = useRef(null)

  useEffect(() => {
    const loader = LOADERS[slug]
    if (!loader) return
    loader().then(mod => setParsed(parseMarkdown(mod.default)))
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
    headerRef.current?.classList.remove('is-visible')
    heroRef.current?.classList.remove('is-visible')
    metaRef.current?.classList.remove('is-visible')
    NAV_ITEMS.forEach(({ id }) => sectionRefs.current[id]?.classList.remove('is-visible'))
  }, [slug])

  useEffect(() => {
    const onMouseMove = e => {
      const nav     = navRef.current
      const content = contentRef.current
      if (!nav || !content) return
      const contentLeft = content.getBoundingClientRect().left
      const inLeftZone  = e.clientX < contentLeft
      nav.style.opacity       = inLeftZone ? '1' : '0'
      nav.style.pointerEvents = inLeftZone ? 'auto' : 'none'
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    if (!parsed.title) return
    requestAnimationFrame(() => {
      headerRef.current?.classList.add('is-visible')
      metaRef.current?.classList.add('is-visible')
      heroRef.current?.classList.add('is-visible')
    })
  }, [parsed.title])

  useEffect(() => {
    if (!parsed.title) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [parsed])

  useEffect(() => {
    if (!parsed.title) return
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.8 }
    )
    document.querySelectorAll('.dp-highlight').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [parsed])

  useEffect(() => {
    if (!parsed.title) return
    const observers = []
    NAV_ITEMS.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [parsed])

  const meta        = parseMetaTable(parsed.sections['Project Meta'])
  const activeIndex = NAV_ITEMS.findIndex(({ id }) => id === activeSection)

  return (
    <div className="dp-page">

      <nav className="nav dp-nav-bar">
        <div className="nav-logo">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="nav-links">
          <Link to="/">PROJECTS</Link>
          <Link to="/about">ABOUT</Link>
          <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </nav>

      <div className="dp-body">

        <aside className="dp-sidebar">
          <Link to="/" className="dp-back">← BACK TO PROJECTS</Link>
          <div className="dp-sidebar-nav" ref={navRef}>
            <div className="dp-track" />
            <span
              className="dp-dot"
              aria-hidden="true"
              style={{ top: `${activeIndex * 48 + 21}px` }}
            />
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#dp-${id}`}
                className={`dp-nav-item${activeSection === id ? ' is-active' : ''}`}
                onClick={e => {
                  e.preventDefault()
                  sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </aside>

        <main className="dp-content" ref={contentRef}>

          <header className="dp-header" ref={headerRef}>
            {parsed.eyebrow && <span className="dp-eyebrow">{parsed.eyebrow}</span>}
            {parsed.title   && <h1 className="dp-title">{parsed.title}</h1>}
            {parsed.subtitle && <p className="dp-subtitle">{parsed.subtitle}</p>}
            <div className="dp-header-divider" />
          </header>

          <div className="dp-hero" ref={heroRef}>
            {COVER_IMAGES[slug]
              ? <img src={COVER_IMAGES[slug]} alt={`${parsed.title} cover`} className="dp-hero-img" />
              : <div className="dp-hero-rect" />
            }
          </div>

          <div className="dp-meta-grid" ref={metaRef}>
            {['Role', 'Keywords', 'Timeline', 'Team'].filter(f => meta[f]).map(field => (
              <div key={field} className="dp-meta-col">
                <p className="dp-meta-label">{field}</p>
                <p className="dp-meta-value">{meta[field]}</p>
              </div>
            ))}
          </div>

          {NAV_ITEMS.map(({ id, label }, i) => {
            const rawContent = getSectionContent(id, parsed.sections)
            const content = clean(rawContent)
            if (!content) return null
            return (
              <section
                key={id}
                id={`dp-${id}`}
                ref={el => { sectionRefs.current[id] = el }}
                className="dp-section"
              >
                <span className="dp-anchor">{label}</span>
                <SectionBlocks content={content} />
              </section>
            )
          })}

          <div className="dp-footer-cta" style={{ marginTop: '120px' }}>
            <Link to="/" className="pill ghost">← BACK TO PROJECTS</Link>
            {NEXT_SLUG[slug] && (
              <Link to={NEXT_SLUG[slug]} className="pill ghost">VIEW NEXT CASE STUDY →</Link>
            )}
          </div>

        </main>
      </div>

      <footer className="footer">
        <span className="footer-credit">Created by MENGHAN</span>
        <div className="nav-links">
          <Link to="/">PROJECTS</Link>
          <Link to="/about">ABOUT</Link>
          <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </footer>
    </div>
  )
}
