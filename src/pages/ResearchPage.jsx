import { useState, useEffect, useRef, Children, isValidElement } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './ResearchPage.css'

import amazonCover    from '../img/research/Amazon-page-cover.svg'
import evCover        from '../img/research/EV-page-cover.svg'
import moomooCover    from '../img/research/Moomoo-page-cover.svg'
import negotiumCover  from '../img/research/Negotium-page-cover.svg'

// Resolve article image paths from markdown (e.g. ../../img/research/Amazon-img1.svg)
const _imgModules = import.meta.glob('../img/research/*.svg', { eager: true })
const RESEARCH_IMG = Object.fromEntries(
  Object.entries(_imgModules).map(([path, mod]) => [path.split('/').pop(), mod.default])
)
function resolveImgSrc(src) {
  const basename = src?.split('/').pop()
  return (basename && RESEARCH_IMG[basename]) || src
}

const COVER_IMAGES = {
  amazon:      amazonCover,
  expertvoice: evCover,
  moomoo:      moomooCover,
  negotium:    negotiumCover,
}

// ── Slug → dynamic import map ──────────────────────────────────────────────
const LOADERS = {
  amazon:      () => import('../content/research/Amazon_text.md?raw'),
  expertvoice: () => import('../content/research/ExpertVoice_text.md?raw'),
  moomoo:      () => import('../content/research/Moomoo_text.md?raw'),
  negotium:    () => import('../content/research/Negotium_text.md?raw'),
}

const NAV_ITEMS = [
  { id: 'overview',    label: 'OVERVIEW' },
  { id: 'methodology', label: 'METHODOLOGY' },
  { id: 'takeaways',   label: 'TAKEAWAYS' },
  { id: 'nextstep',    label: 'NEXT STEP' },
  { id: 'learnings',   label: 'MY LEARNINGS' },
]

// Each nav id maps to one or more H2 section names in the markdown
const SECTION_MAP = {
  overview:    ['Project Overview'],
  methodology: ['Methodology', 'Challenges'],
  takeaways:   ['Key Takeaways'],
  nextstep:    ['Next Steps'],
  learnings:   ['My Learnings'],
}

// ── Markdown utilities ──────────────────────────────────────────────────────
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

// Strip image placeholders like [📎 Insert X here]
function clean(text) {
  return text
    .replace(/\[📎[^\]]*\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Expand :::two-col\n![alt](src)\n![alt](src)\n::: into consecutive image lines
// ReactMarkdown groups them into one <p>, which the custom p renderer maps to ArticleImageTwoColumn
function expandTwoColBlocks(text) {
  return text.replace(/:::two-col\n([\s\S]*?)\n:::/g, (_, inner) => inner.trim())
}

// ── Article image components (from Figma Article/Image-one-column & two-column) ──
function ArticleImageOneColumn({ src, alt }) {
  return (
    <div className="rp-img-one-col">
      <img src={src} alt={alt || ''} className="rp-img" />
      {alt && <p className="rp-img-caption">{alt}</p>}
    </div>
  )
}

function ArticleImageTwoColumn({ leftSrc, leftAlt, rightSrc, rightAlt }) {
  return (
    <div className="rp-img-two-col">
      <div className="rp-img-col">
        <img src={leftSrc} alt={leftAlt || ''} className="rp-img" />
        {leftAlt && <p className="rp-img-caption">{leftAlt}</p>}
      </div>
      <div className="rp-img-col">
        <img src={rightSrc} alt={rightAlt || ''} className="rp-img" />
        {rightAlt && <p className="rp-img-caption">{rightAlt}</p>}
      </div>
    </div>
  )
}

// ── ReactMarkdown custom renderers ─────────────────────────────────────────
const mdComponents = {
  // H1/H2 are structural — don't render them inside sections
  h1: () => null,
  h2: () => null,
  hr: () => null,
  h3: ({ children }) => <h3 className="rp-h3">{children}</h3>,
  p: ({ children }) => {
    // Detect special marker for LinkedIn button: [linkedin-button] or [linkedin-button:Custom text]
    const arr = Children.toArray(children)
    if (arr.length === 1 && typeof arr[0] === 'string') {
      const match = arr[0].match(/^\[linkedin-button(?::(.+))?\]$/)
      if (match) {
        const label = match[1] || 'Read about specific findings here if you are interested!'
        return (
          <div className="rp-inline-action">
            <a
              href="https://www.linkedin.com/in/menghl/"
              target="_blank"
              rel="noopener noreferrer"
              className="pill ghost"
            >
              {label}
            </a>
          </div>
        )
      }
    }
    // Detect image-only paragraphs and render the Figma image templates
    const nodes = Children.toArray(children).filter(
      c => !(typeof c === 'string' && !c.trim())
    )
    const imgs = nodes.filter(el => isValidElement(el) && el.type === 'img')
    if (imgs.length > 0 && imgs.length === nodes.length) {
      if (imgs.length === 1) {
        const { src, alt } = imgs[0].props
        return <ArticleImageOneColumn src={resolveImgSrc(src)} alt={alt} />
      }
      if (imgs.length === 2) {
        const [l, r] = imgs
        return <ArticleImageTwoColumn
          leftSrc={resolveImgSrc(l.props.src)}  leftAlt={l.props.alt}
          rightSrc={resolveImgSrc(r.props.src)} rightAlt={r.props.alt}
        />
      }
    }
    return <p className="rp-para">{children}</p>
  },
  blockquote: ({ children }) => (
    <blockquote className="rp-pullquote">{children}</blockquote>
  ),
  ul: ({ children }) => <ul className="rp-list">{children}</ul>,
  ol: ({ children }) => <ol className="rp-list rp-list--ol">{children}</ol>,
  li: ({ children }) => <li className="rp-list-item">{children}</li>,
  strong: ({ children }) => <strong className="rp-strong">{children}</strong>,
  // Tables (Project Meta) — skip here; parsed separately
  table: () => null,
}

// ── Logo SVG (same as homepage) ─────────────────────────────────────────────
function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Menghan">
      <g transform="translate(4.36, 2.18)">
        <path d="M11.648 14.8189C11.4386 14.8189 11.2582 14.7258 11.1069 14.5396C10.9673 14.3535 10.8975 14.0276 10.8975 13.5622C10.8975 13.2945 10.9499 12.9804 11.0546 12.6196C11.2873 11.8865 11.5259 11.1011 11.7702 10.2633C12.0262 9.42546 12.2648 8.57018 12.4859 7.69746C12.7186 6.82473 12.9048 5.98109 13.0444 5.16655C13.184 4.34036 13.2539 3.584 13.2539 2.89745C13.2539 2.66473 13.2422 2.43782 13.2189 2.21673C13.2073 1.99564 13.1782 1.78618 13.1317 1.58836C11.9564 2.70545 10.8684 4.224 9.86767 6.144C8.87858 8.05236 7.97676 10.2749 7.16222 12.8116C7.02258 13.1956 6.84804 13.4633 6.63858 13.6145C6.42913 13.7658 6.23131 13.8415 6.04513 13.8415C5.88222 13.8415 5.72513 13.7775 5.57386 13.6495C5.42258 13.5098 5.34695 13.3004 5.34695 13.0211C5.34695 12.8349 5.39349 12.5731 5.48658 12.2356C5.57967 11.8865 5.74258 11.5665 5.97531 11.2756C6.10331 10.5076 6.20804 9.69309 6.28949 8.832C6.38258 7.97091 6.42913 7.17382 6.42913 6.44073C6.42913 6.10327 6.41167 5.78909 6.37676 5.49818C6.35349 5.19564 6.31276 4.93382 6.25458 4.71273C5.64949 5.35273 5.08513 6.15564 4.56149 7.12146C4.04949 8.07564 3.59567 9.10546 3.20004 10.2109C2.8044 11.3047 2.47276 12.3753 2.20513 13.4225C1.99567 14.1789 1.65822 14.5571 1.19276 14.5571C1.00658 14.5571 0.849491 14.4582 0.721491 14.2604C0.605127 14.0625 0.546945 13.7658 0.546945 13.3702C0.546945 12.9862 0.640036 12.4684 0.826218 11.8167C1.0124 11.1651 1.26258 10.4495 1.57676 9.66982C1.90258 8.89018 2.26331 8.11636 2.65895 7.34836C3.06622 6.56873 3.48513 5.85891 3.91567 5.21891C4.35785 4.56727 4.7884 4.04364 5.20731 3.648C5.62622 3.25236 6.0044 3.05455 6.34186 3.05455C6.56295 3.05455 6.76076 3.09527 6.93531 3.17673C7.10986 3.25818 7.26113 3.42691 7.38913 3.68291C7.51713 3.92727 7.61022 4.30546 7.6684 4.81745C7.73822 5.31782 7.77313 5.98691 7.77313 6.82473C7.77313 6.976 7.77313 7.15055 7.77313 7.34836C8.11058 6.41745 8.5004 5.51564 8.94258 4.64291C9.3964 3.75855 9.87349 2.96727 10.3739 2.26909C10.8742 1.57091 11.3746 1.01818 11.8749 0.61091C12.3753 0.203637 12.8466 0 13.2888 0C13.7891 0 14.1964 0.273455 14.5106 0.820364C14.8248 1.35564 14.9819 2.19927 14.9819 3.35127C14.9819 4.44509 14.8946 5.50982 14.72 6.54546C14.5455 7.58109 14.3244 8.55855 14.0568 9.47782C13.8008 10.3971 13.5331 11.2349 13.2539 11.9913C12.9862 12.736 12.7535 13.376 12.5557 13.9113C12.4277 14.2371 12.2939 14.4698 12.1542 14.6095C12.0146 14.7491 11.8459 14.8189 11.648 14.8189Z" fill="url(#rp-logo-m)"/>
        <circle cx="1.81819" cy="17.9695" r="1.81818" fill="url(#rp-logo-d1)"/>
        <circle cx="10.5455" cy="17.9695" r="1.81818" fill="url(#rp-logo-d2)"/>
      </g>
      <defs>
        <linearGradient id="rp-logo-m" x1="6.247" y1="3.543" x2="19.703" y2="17.389" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
        <linearGradient id="rp-logo-d1" x1="4.698" y1="18.666" x2="7.996" y2="22.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
        <linearGradient id="rp-logo-d2" x1="13.425" y1="18.666" x2="16.723" y2="22.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ── Component ───────────────────────────────────────────────────────────────
export default function ResearchPage({ slug }) {
  const [parsed, setParsed] = useState({ title: '', subtitle: '', eyebrow: '', sections: {} })
  const [activeSection, setActiveSection] = useState('overview')
  const sectionRefs = useRef({})
  const contentRef  = useRef(null)
  const navRef      = useRef(null)
  const headerRef   = useRef(null)
  const heroRef     = useRef(null)
  const metaRef     = useRef(null)

  // Load + parse markdown
  useEffect(() => {
    const loader = LOADERS[slug]
    if (!loader) return
    loader().then(mod => setParsed(parseMarkdown(mod.default)))
  }, [slug])

  // Scroll to top + reset animations on slug change
  useEffect(() => {
    window.scrollTo(0, 0)
    headerRef.current?.classList.remove('is-visible')
    heroRef.current?.classList.remove('is-visible')
    metaRef.current?.classList.remove('is-visible')
    NAV_ITEMS.forEach(({ id }) => sectionRefs.current[id]?.classList.remove('is-visible'))
  }, [slug])

  // Section nav: show when cursor is in the left zone, hide otherwise
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

  // Fade in header + meta immediately, hero 150ms later
  useEffect(() => {
    if (!parsed.title) return
    requestAnimationFrame(() => {
      headerRef.current?.classList.add('is-visible')
      metaRef.current?.classList.add('is-visible')
      heroRef.current?.classList.add('is-visible')
    })
  }, [parsed.title])

  // Scroll-triggered section fade-in
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

  // IntersectionObserver: update active nav as sections enter viewport
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
    <div className="rp-page">

      {/* Navigation */}
      <nav className="nav rp-nav-bar">
        <div className="nav-logo">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="nav-links">
          <Link to="/">PROJECTS</Link>
          <Link to="/">ABOUT</Link>
          <a href="#">LINKEDIN</a>
        </div>
      </nav>

      <div className="rp-body">

        {/* Left sidebar */}
        <aside className="rp-sidebar">
          <Link to="/" className="rp-back">← BACK TO PROJECTS</Link>
          <div className="rp-sidebar-nav" ref={navRef}>
            <div className="rp-track" />
            <span
              className="rp-dot"
              aria-hidden="true"
              style={{ top: `${activeIndex * 48 + 21}px` }}
            />
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#rp-${id}`}
                className={`rp-nav-item${activeSection === id ? ' is-active' : ''}`}
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

        {/* Content column */}
        <main className="rp-content" ref={contentRef}>

          {/* Header */}
          <header className="rp-header" ref={headerRef}>
            {parsed.eyebrow && (
              <span className="rp-eyebrow">{parsed.eyebrow}</span>
            )}
            {parsed.title && (
              <h1 className="rp-title">{parsed.title}</h1>
            )}
            {parsed.subtitle && (
              <p className="rp-subtitle">{parsed.subtitle}</p>
            )}
            <div className="rp-header-divider" />
          </header>

          {/* Hero Image */}
          <div className="rp-hero" ref={heroRef}>
            {COVER_IMAGES[slug]
              ? <img src={COVER_IMAGES[slug]} alt={`${parsed.title} cover`} className="rp-hero-img" />
              : <div className="rp-hero-rect" />
            }
          </div>

          {/* Project Meta */}
          <div className="rp-meta-grid" ref={metaRef}>
            {['Role', 'Keywords', 'Timeline', 'Team'].filter(f => meta[f]).map(field => (
              <div key={field} className="rp-meta-col">
                <p className="rp-meta-label">{field}</p>
                <p className="rp-meta-value">{meta[field]}</p>
              </div>
            ))}
          </div>

          {/* Sections */}
          {NAV_ITEMS.map(({ id, label }, i) => {
            const content = clean(getSectionContent(id, parsed.sections))
            if (!content) return null
            return (
              <section
                key={id}
                id={`rp-${id}`}
                ref={el => { sectionRefs.current[id] = el }}
                className="rp-section"
                style={i > 0 ? { marginTop: '64px' } : undefined}
              >
                <span className="rp-anchor">
                  {label}
                </span>
                <ReactMarkdown components={mdComponents}>{expandTwoColBlocks(content)}</ReactMarkdown>
              </section>
            )
          })}

          {/* Footer CTA */}
          <div className="rp-footer-cta" style={{ marginTop: '120px' }}>
            <Link to="/" className="pill ghost">← BACK TO PROJECTS</Link>
            <Link to={({ amazon: '/research/expertvoice', expertvoice: '/research/moomoo', moomoo: '/research/negotium', negotium: '/research/amazon' })[slug]} className="pill ghost">VIEW NEXT CASE STUDY →</Link>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-credit">Created by MENGHAN</span>
        <div className="nav-links">
          <Link to="/">PROJECTS</Link>
          <Link to="/">ABOUT</Link>
          <a href="#">LINKEDIN</a>
        </div>
      </footer>
    </div>
  )
}
