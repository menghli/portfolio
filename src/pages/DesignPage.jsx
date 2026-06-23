import { useState, useEffect, useRef, Children, isValidElement, cloneElement } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './DesignPage.css'

const _designImgModules = import.meta.glob('../img/design/**/*.svg', { eager: true })
const _designVideoModules = import.meta.glob('../img/design/**/*.mp4', { eager: true })
const _designGifModules = import.meta.glob('../img/design/**/*.gif', { eager: true })
const DESIGN_IMG = Object.fromEntries([
  ...Object.entries(_designImgModules).map(([path, mod]) => [path.split('/').pop(), mod.default]),
  ...Object.entries(_designVideoModules).map(([path, mod]) => [path.split('/').pop(), mod.default]),
  ...Object.entries(_designGifModules).map(([path, mod]) => [path.split('/').pop(), mod.default]),
])
function resolveImgSrc(src) {
  const basename = src?.split('/').pop()
  return (basename && DESIGN_IMG[basename]) || src
}

const COVER_IMAGES = {
  'pin-mi':   DESIGN_IMG['Pin-MI-page-cover.svg'],
  'dubjam':   DESIGN_IMG['Dubjam-page-cover.svg'],
  'dory-vr':  DESIGN_IMG['DoryVR-page-cover.svg'],
  'work365':  DESIGN_IMG['Work365-page-cover.svg'],
}

const LOADERS = {
  'pin-mi':   () => import('../content/design/pin-mi.md?raw'),
  'dubjam':   () => import('../content/design/dubjam.md?raw'),
  'dory-vr':  () => import('../content/design/dory-vr.md?raw'),
  'work365':  () => import('../content/design/work365.md?raw'),
}

const NAV_ITEMS = [
  { id: 'overview',    label: 'OVERVIEW' },
  { id: 'solution',    label: 'SOLUTION PREVIEW' },
  { id: 'research',    label: 'RESEARCH' },
  { id: 'exploration', label: 'DESIGN DECISIONS' },
  { id: 'design',      label: 'FINAL SOLUTION' },
  { id: 'outcome',     label: 'OUTCOME' },
  { id: 'reflections', label: 'REFLECTIONS' },
]

const SECTION_MAP = {
  overview:    ['Project Overview'],
  solution:    ['Solution Preview'],
  research:    ['Research', 'Initial Research', 'How Might We'],
  exploration: ['Design Decisions', 'Exploration', 'Iteration 1', 'User Testing',
                'Defining the Experience and Ideation', 'Design System',
                'Challenges We Faced During the Process'],
  design:      ['Solution Overview', 'Design', 'Final Iteration', 'Final Solution'],
  outcome:     ['Outcomes', 'Outcome'],
  reflections: ['My Learnings', 'Reflections'],
}

const NEXT_SLUG = {
  'pin-mi':   '/design/dubjam',
  'dubjam':   '/design/dory-vr',
  'dory-vr':  '/design/work365',
  'work365':  '/design/pin-mi',
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
      <img src={resolveImgSrc(src)} alt={alt || ''} className="dp-img" loading="lazy" />
      {alt && <p className="dp-img-caption">{alt}</p>}
    </div>
  )
}

function ArticleImageTwoColumn({ leftSrc, leftAlt, rightSrc, rightAlt }) {
  return (
    <div className="dp-img-two-col">
      <div className="dp-img-col">
        <img src={resolveImgSrc(leftSrc)} alt={leftAlt || ''} className="dp-img" loading="lazy" />
        {leftAlt && <p className="dp-img-caption">{leftAlt}</p>}
      </div>
      <div className="dp-img-col">
        <img src={resolveImgSrc(rightSrc)} alt={rightAlt || ''} className="dp-img" loading="lazy" />
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
  h3: ({ children }) => {
    const rawText = Children.toArray(children)
      .map(c => (typeof c === 'string' ? c : ''))
      .join('')
    const dfMatch = rawText.match(/^Design feature (\d+):\s*(.+)$/)
    if (dfMatch) {
      return (
        <div className="dp-df-heading">
          <span className="dp-df-badge">Feature {dfMatch[1]}</span>
          <h3 className="dp-df-title">{dfMatch[2]}</h3>
        </div>
      )
    }
    return <h3 className="dp-h3">{processHighlights(children)}</h3>
  },
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

      const ghostMatch = arr[0].match(/^\[ghost-button:([^:]+)(?::(.+))?\]$/)
      if (ghostMatch) {
        const label = ghostMatch[1].trim()
        const href = ghostMatch[2]?.trim() || '#'
        const isExternal = href.startsWith('http')
        return (
          <div className="dp-inline-action">
            <a href={href} className="pill ghost" {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{label}</a>
          </div>
        )
      }
    }

    if (arr.length >= 2 && isValidElement(arr[0]) && arr[0].type === mdComponents.strong) {
      const labelText = [].concat(arr[0].props.children).join('').replace(/:$/, '')
      if (labelText) {
        const rowSlug = labelText.toLowerCase().replace(/\s+/g, '-')
        const bodyParts = arr.slice(1).map((node, i) =>
          i === 0 && typeof node === 'string' ? node.replace(/^\s+/, '') : node
        )
        return (
          <div className={`dp-is-row dp-is-row--${rowSlug}`}>
            <div className="dp-is-header">
              <span className="dp-is-label">{labelText}</span>
            </div>
            <p className="dp-is-body">{processHighlights(bodyParts)}</p>
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

// ── Concept toggle ────────────────────────────────────────────────────────
function parseConceptsBlock(content) {
  const concepts = []
  let current = null
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (t.startsWith('== ')) {
      if (current) concepts.push(current)
      current = { title: t.slice(3), body: '', items: [] }
    } else if (t.startsWith('-- ') && current) {
      const raw = t.slice(3)
      const pipes = raw.split(' | ')
      const itemText = pipes[0].trim()
      const img = pipes[1]?.trim() || ''
      const natural = (pipes[2]?.trim() || '') === 'natural'
      const sep = itemText.indexOf(' · ')
      if (sep > -1) {
        current.items.push({ type: itemText.slice(0, sep).trim(), label: itemText.slice(sep + 3).trim(), img, natural })
      } else {
        current.items.push({ type: '', label: itemText, img, natural })
      }
    } else if (current) {
      current.body = current.body ? current.body + ' ' + t : t
    }
  }
  if (current) concepts.push(current)
  return concepts.map(c => ({ ...c, body: c.body.trim() }))
}

function ConceptToggle({ concepts }) {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  function go(idx) {
    if (idx === active) return
    setDir(idx > active ? 1 : -1)
    setActive(idx)
    setPanelKey(k => k + 1)
  }

  const concept = concepts[active]
  const hasTypes = concept.items.some(item => item.type)
  const isAsymmetric = !hasTypes && concept.items.length === 2

  return (
    <div className="dp-concepts">
      <div className="dp-concepts-nav" role="tablist" aria-label="Design concepts">
        <div
          className="dp-concepts-indicator"
          style={{ transform: `translateX(calc(${active} * 100%))` }}
          aria-hidden="true"
        />
        {concepts.map((_, i) => (
          <button
            key={i}
            role="tab"
            className={`dp-concepts-tab${active === i ? ' is-active' : ''}`}
            aria-selected={active === i}
            onClick={() => go(i)}
          >
            Concept {i + 1}
          </button>
        ))}
      </div>

      <div
        key={panelKey}
        role="tabpanel"
        className={`dp-concepts-panel${dir === 1 ? ' dp-concepts-panel--fwd' : dir === -1 ? ' dp-concepts-panel--bwd' : ''}`}
      >
        <h4 className="dp-concepts-heading">{concept.title}</h4>
        {concept.body && <p className="dp-concepts-desc">{concept.body}</p>}
        {concept.items.length > 0 && (
          <div className={`dp-concepts-items${isAsymmetric ? ' dp-concepts-items--asym' : ''}`}>
            {concept.items.map((item, i) => {
              const isAccentType = item.type === 'After' || item.type === 'Idea 2'
              const isAccentBg   = isAccentType && !item.img
              const labelAbove   = !item.type || item.type === 'Before' || item.type === 'After'
              const phClass = `dp-concepts-ph${isAccentBg ? ' dp-concepts-ph--cool' : ''}${item.natural ? ' dp-concepts-ph--natural' : ''}${item.img ? ' dp-concepts-ph--img' : ''}`
              const phContent = item.img
                ? <img src={resolveImgSrc(item.img)} alt={item.label} className="dp-concepts-img" loading="lazy" />
                : <span className="dp-concepts-ph-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <rect x="1" y="1" width="20" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="7" cy="7" r="1.8" fill="currentColor" opacity="0.45"/>
                      <path d="M1 16l6-5 4.5 3.5 3.5-3 7 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.45"/>
                    </svg>
                  </span>
              return (
                <div key={i} className="dp-concepts-item">
                  {labelAbove ? (
                    <>
                      <div className="dp-concepts-item-header">
                        {item.type && (
                          <span className={`dp-concepts-tag${isAccentType ? ' dp-concepts-tag--accent' : ''}`}>
                            {item.type}
                          </span>
                        )}
                        {!item.type
                          ? <div className="dp-concepts-caption">
                              <span className="dp-concepts-num" aria-hidden="true">{i + 1}</span>
                              <span className="dp-concepts-label">{item.label}</span>
                            </div>
                          : <span className="dp-concepts-label">{item.label}</span>
                        }
                      </div>
                      <div className={phClass}>{phContent}</div>
                    </>
                  ) : (
                    <>
                      {item.type && (
                        <span className={`dp-concepts-tag${isAccentType ? ' dp-concepts-tag--accent' : ''}`}>
                          {item.type}
                        </span>
                      )}
                      <div className={phClass}>{phContent}</div>
                      <div className={`dp-concepts-caption${item.type ? ' dp-concepts-caption--center' : ''}`}>
                        {!item.type && (
                          <span className="dp-concepts-num" aria-hidden="true">{i + 1}</span>
                        )}
                        <span className="dp-concepts-label">{item.label}</span>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Image tab toggle ──────────────────────────────────────────────────────
function ImageTabToggle({ tabs }) {
  const [active, setActive] = useState(0)

  return (
    <div className="dp-itabs">
      <div className="dp-itabs-nav" role="tablist">
        <div
          className="dp-itabs-indicator"
          style={{ width: `calc((100% - 8px) / ${tabs.length})`, transform: `translateX(calc(${active} * 100%))` }}
          aria-hidden="true"
        />
        {tabs.map((t, i) => (
          <button
            key={i}
            role="tab"
            className={`dp-itabs-tab${active === i ? ' is-active' : ''}`}
            aria-selected={active === i}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="dp-itabs-panel" role="tabpanel">
        <div className="dp-itabs-frame">
          {tabs.map((t, i) => (
            <img
              key={i}
              src={resolveImgSrc(t.src)}
              alt={t.caption}
              className={`dp-itabs-img${active === i ? ' is-active' : ''}`}
              loading="lazy"
            />
          ))}
        </div>
        <div className="dp-itabs-captions">
          {tabs.map((t, i) => (
            t.caption
              ? <p key={i} className={`dp-itabs-caption${active === i ? ' is-active' : ''}`}>{t.caption}</p>
              : null
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Feature tab toggle (image + bullet list per tab) ─────────────────────
function parseFeatureTabsBlock(content) {
  const tabs = []
  let current = null
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (t.startsWith('== ')) {
      if (current) tabs.push(current)
      const rest = t.slice(3)
      const pipeIdx = rest.indexOf('|')
      current = {
        label:   pipeIdx > -1 ? rest.slice(0, pipeIdx).trim() : rest.trim(),
        src:     pipeIdx > -1 ? rest.slice(pipeIdx + 1).trim() : '',
        bullets: [],
      }
    } else if (t.startsWith('- ') && current) {
      current.bullets.push(t.slice(2))
    }
  }
  if (current) tabs.push(current)
  return tabs
}

function FeatureTabToggle({ tabs }) {
  const [active, setActive] = useState(0)

  return (
    <div className="dp-itabs">
      <div className="dp-itabs-nav" role="tablist" data-count={tabs.length}>
        <div
          className="dp-itabs-indicator"
          style={{ width: `calc((100% - 8px) / ${tabs.length})`, transform: `translateX(calc(${active} * 100%))` }}
          aria-hidden="true"
        />
        {tabs.map((t, i) => (
          <button
            key={i}
            role="tab"
            className={`dp-itabs-tab${active === i ? ' is-active' : ''}`}
            aria-selected={active === i}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="dp-itabs-panel" role="tabpanel">
        <div className="dp-itabs-frame">
          {tabs.map((t, i) => (
            <img
              key={i}
              src={resolveImgSrc(t.src)}
              alt={t.label}
              className={`dp-itabs-img${active === i ? ' is-active' : ''}`}
              loading="lazy"
            />
          ))}
        </div>
        <div className="dp-itabs-bullet-groups">
          {tabs.map((t, i) => (
            <ul key={i} className={`dp-fscreens-bullets dp-itabs-bullet-group${active === i ? ' is-active' : ''}`}>
              {t.bullets.map((b, j) => (
                <li key={j} className="dp-fscreens-bullet">{b}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
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
            loading="lazy"
          />
          <img
            src={resolveImgSrc(newSrc)}
            alt="New design"
            className={`dp-img-toggle-img${active === 'new' ? ' is-active' : ''}`}
            loading="lazy"
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
              loading="lazy"
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

// ── Auto-scrolling gallery ────────────────────────────────────────
function AutoGallery({ slides }) {
  const doubled = [...slides, ...slides]
  return (
    <div className="dp-auto-gallery" aria-label="Research artifacts">
      <div className="dp-auto-gallery-track">
        {doubled.map((slide, i) => (
          <div
            key={i}
            className="dp-auto-gallery-slide"
            aria-hidden={i >= slides.length ? 'true' : undefined}
          >
            <div className="dp-auto-gallery-img-wrap">
              <img
                src={resolveImgSrc(slide.src)}
                alt={slide.label || ''}
                className="dp-auto-gallery-img"
                loading="lazy"
              />
            </div>
            {slide.label && (
              <p className="dp-auto-gallery-label">{slide.label}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Decision Cards ────────────────────────────────────────────────
function parseDecisionCards(content) {
  const cards = []
  let current = null
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (t.startsWith('== ')) {
      if (current) cards.push(current)
      current = { title: t.slice(3), body: '' }
    } else if (current && t) {
      current.body = current.body ? current.body + ' ' + t : t
    }
  }
  if (current) cards.push(current)
  return cards
}

function DecisionCards({ cards }) {
  return (
    <div className="dp-decision-cards">
      {cards.map((card, i) => (
        <article key={i} className="dp-decision-card">
          <h4 className="dp-decision-title">{card.title}</h4>
          <p className="dp-decision-body">{card.body}</p>
        </article>
      ))}
    </div>
  )
}

// ── Horizontal workflow timeline ──────────────────────────────────
function Timeline({ items }) {
  return (
    <div className="dp-htl" role="list" aria-label="How we built it">
      {items.map((item, i) => (
        <div key={i} className="dp-htl-entry" role="listitem">
          <div className={`dp-htl-step${i === items.length - 1 ? ' dp-htl-step--last' : ''}`}>
            <span className="dp-htl-num">{String(i + 1).padStart(2, '0')}</span>
            <p className="dp-htl-label">{item.title}</p>
          </div>
          {i < items.length - 1 && (
            <div className="dp-htl-arrow" aria-hidden="true">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M0 5H11.5M8 1.5L12 5L8 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Challenge Cards ───────────────────────────────────────────────
function parseChallengeCards(content) {
  const challenges = []
  let current = null
  let pendingList = []

  const parseImgPair = (raw) =>
    raw.split('+').map(s => {
      const parts = s.trim().split('|').map(p => p.trim())
      return { src: parts[0], label: parts[1] || '' }
    })

  const flushList = () => {
    if (pendingList.length && current) {
      current.body.push({ type: 'paragraph', text: pendingList.join('\n') })
      pendingList = []
    }
  }

  for (const line of content.split('\n')) {
    const t = line.trim()
    if (t.startsWith('== ')) {
      flushList()
      if (current) challenges.push(current)
      current = { title: t.slice(3), body: [] }
    } else if (t.startsWith('--side ') && current) {
      flushList()
      current.body.push({ type: 'img-row', images: parseImgPair(t.slice(7)) })
    } else if (t.startsWith('--stack ') && current) {
      flushList()
      current.body.push({ type: 'img-stack', images: parseImgPair(t.slice(8)) })
    } else if (t.startsWith('-- ') && current) {
      flushList()
      const parts = t.slice(3).split('|').map(s => s.trim())
      current.body.push({ type: 'img-row', images: [{ src: parts[0], label: parts[1] || '' }] })
    } else if (current && t.startsWith('* ')) {
      pendingList.push(t)
    } else if (current && t) {
      flushList()
      current.body.push({ type: 'paragraph', text: t })
    } else if (current && !t) {
      flushList()
    }
  }
  flushList()
  if (current) challenges.push(current)
  return challenges
}

function ChallengeCards({ challenges }) {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(0)
  const [panelKey, setPanelKey] = useState(0)
  const count = challenges.length
  const wrapperRef = useRef(null)

  useEffect(() => {
    let obs
    const delay = panelKey === 0 ? 0 : 420
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              obs.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 }
      )
      const container = wrapperRef.current
      if (container) {
        container.querySelectorAll('.dp-highlight').forEach(el => obs.observe(el))
      }
    }, delay)
    return () => {
      clearTimeout(timer)
      obs?.disconnect()
    }
  }, [panelKey])

  function go(next, direction) {
    if (next === active) return
    setDir(direction)
    setActive(next)
    setPanelKey(k => k + 1)
    const el = wrapperRef.current
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const ch = challenges[active]
  const colonIdx = ch.title.indexOf(': ')
  const titleLabel = colonIdx > -1 ? ch.title.slice(0, colonIdx) : ''
  const titleText  = colonIdx > -1 ? ch.title.slice(colonIdx + 2) : ch.title

  return (
    <div className="dp-cc-wrapper" ref={wrapperRef}>
      <div className="dp-challenge-cards">
      <div
        key={panelKey}
        className={`dp-cc-content${dir === 1 ? ' dp-cc-content--fwd' : dir === -1 ? ' dp-cc-content--bwd' : ''}`}
      >
        <div className="dp-cc-header">
          {titleLabel && <span className="dp-cc-label">{titleLabel}</span>}
          <h3 className="dp-cc-title">{titleText}</h3>
        </div>
        <div className="dp-cc-body-flow">
          {ch.body.map((item, i) => {
            if (item.type === 'paragraph') {
              return (
                <ReactMarkdown
                  key={i}
                  components={{
                    p: ({ children }) => <p className="dp-cc-body">{processHighlights(children)}</p>,
                    strong: ({ children }) => <strong className="dp-strong">{children}</strong>,
                    li: ({ children }) => <li className="dp-list-item">{processHighlights(children)}</li>,
                  }}
                >{item.text}</ReactMarkdown>
              )
            }
            const isStack = item.type === 'img-stack'
            return (
              <div key={i} className={isStack ? 'dp-cc-img-stack' : 'dp-cc-img-row'}>
                {item.images.map((img, j) => (
                  <div key={j} className="dp-cc-img-cell">
                    <img src={resolveImgSrc(img.src)} alt={img.label || ''} className="dp-cc-img" loading="lazy" />
                    {img.label && <p className="dp-cc-img-label">{img.label}</p>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
      </div>
      <div className="dp-cc-nav">
        <button
          className="dp-cc-arrow"
          onClick={() => go(((active - 1) + count) % count, -1)}
          aria-label="Previous challenge"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{transform:'rotate(180deg)'}}>
            <path d="M2.667 8H13.333M9 3.667L13.333 8L9 12.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="dp-cc-counter">{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        <button
          className="dp-cc-arrow"
          onClick={() => go((active + 1) % count, 1)}
          aria-label="Next challenge"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.667 8H13.333M9 3.667L13.333 8L9 12.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Design Sticky Scroll ───────────────────────────────────────────────────
function parseDesignSticky(content) {
  const features = []
  let current = null
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (t.startsWith('== ')) {
      if (current) features.push(current)
      const parts = t.slice(3).split('|').map(s => s.trim())
      current = { num: parts[0], title: parts[1] || '', body: '', placeholders: [] }
    } else if (t.startsWith('-- ') && current) {
      const rest = t.slice(3).trim()
      const pipeIdx = rest.indexOf('|')
      if (pipeIdx > -1) {
        current.placeholders.push({ src: rest.slice(0, pipeIdx).trim(), caption: rest.slice(pipeIdx + 1).trim() })
      } else {
        current.placeholders.push({ src: '', caption: rest })
      }
    } else if (current && t) {
      current.body += (current.body ? ' ' : '') + t
    }
  }
  if (current) features.push(current)
  return features
}

function DesignSticky({ features }) {
  const sectionRef  = useRef(null)
  const lastTextRef = useRef(null)

  useEffect(() => {
    const el       = sectionRef.current
    const lastText = lastTextRef.current
    if (!el) return
    const page = el.closest('.dp-page')
    if (!page) return

    // Turn dark ON when section enters; turn dark OFF only when scrolled back above it
    const sectionObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        page.dataset.darkmode = 'true'
      } else if (entry.boundingClientRect.top > 0) {
        // Section is below viewport — user scrolled back up above the section
        page.dataset.darkmode = 'false'
      }
    }, { threshold: 0 })
    sectionObs.observe(el)

    // Turn dark OFF when the last sticky text scrolls off the top of the viewport
    const lastTextObs = lastText ? new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        page.dataset.darkmode = 'false'
      }
    }, { threshold: 0 }) : null
    if (lastText && lastTextObs) lastTextObs.observe(lastText)

    return () => {
      sectionObs.disconnect()
      lastTextObs?.disconnect()
      delete page.dataset.darkmode
    }
  }, [])

  return (
    <div className="dp-ds-section" ref={sectionRef}>
      {features.map((f, i) => (
        <div key={i} className="dp-ds-feature">
          <div className="dp-ds-text" ref={i === features.length - 1 ? lastTextRef : null}>
            <span className="dp-ds-num">{f.num}</span>
            <h3 className="dp-ds-title">{f.title}</h3>
            <p className="dp-ds-body">{f.body}</p>
          </div>
          <div className="dp-ds-media">
            {f.placeholders.map((item, j) => {
              const src = item.src ? resolveImgSrc(item.src) : null
              const isVideo = item.src && /\.(mp4|webm|mov)$/i.test(item.src)
              const isImg   = item.src && /\.(svg|png|jpg|jpeg|webp|avif)$/i.test(item.src)
              return (
                <div key={j} className="dp-ds-item">
                  {isVideo ? (
                    <video className="dp-ds-media-el" src={src} autoPlay muted loop playsInline />
                  ) : isImg ? (
                    <img className="dp-ds-media-el" src={src} alt={item.caption || ''} />
                  ) : (
                    <div className="dp-ds-placeholder" aria-hidden="true" />
                  )}
                  {item.caption && <p className="dp-ds-caption">{item.caption}</p>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
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
        const raw = pipeIdx > -1
          ? { label: line.slice(0, pipeIdx).trim(), text: line.slice(pipeIdx + 1).trim() }
          : { label: '', text: line.trim() }
        const dotIdx = raw.text.indexOf(' · ')
        if (dotIdx === -1) return { ...raw, quote: null }
        const mainText = raw.text.slice(0, dotIdx)
        const quoteRaw = raw.text.slice(dotIdx + 3).trim()
        const quote = quoteRaw.replace(/^\*(.+)\*$/, '$1').trim()
        return { ...raw, text: mainText, quote }
      })
      return (
        <div key={bi} className="dp-findings">
          {items.map((item, i) => (
            <div key={i} className="dp-finding" style={{ '--i': i }}>
              <div className="dp-finding-meta">
                <span className="dp-finding-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="dp-finding-label">{item.label}</span>
              </div>
              <div className="dp-finding-body">
                <p className="dp-finding-text">{item.text}</p>
                {item.quote && <p className="dp-finding-quote"><em>{item.quote}</em></p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'priority-blocks') {
      const ICONS = {
        people: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
        info: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        ),
        search: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        ),
        layers: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        ),
        chart: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        ),
        expand: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        ),
        learn: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        ),
        funnel: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
        ),
        eye: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        ),
      }
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const parts = line.split('|').map(s => s.trim())
        return { title: parts[0], desc: parts[1] || '', icon: parts[2] || 'info' }
      })
      return (
        <div key={bi} className="dp-priority-blocks">
          {items.map((item, i) => (
            <div key={i} className="dp-priority-block">
              <div className="dp-priority-icon-circle">{ICONS[item.icon] || ICONS.info}</div>
              <p className="dp-priority-title">{item.title}</p>
              {item.desc && <p className="dp-priority-desc">{item.desc}</p>}
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'concept-pair') {
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const parts = line.split('|').map(s => s.trim())
        return { tag: parts[0], desc: parts[1], img: parts[2], theme: parts[3] || 'warm' }
      })
      return (
        <div key={bi} className="dp-concept-pair">
          {items.map((item, i) => (
            <div key={i} className={`dp-concept-card dp-concept-card--${item.theme}`}>
              {item.img && (
                <div className="dp-concept-img-wrap">
                  <img src={resolveImgSrc(item.img)} alt={item.tag} className="dp-concept-img" loading="lazy" />
                </div>
              )}
              <div className="dp-concept-label-wrap">
                <p className="dp-concept-desc"><strong>{item.tag}</strong>: {item.desc}</p>
              </div>
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

    if (block.type === 'auto-gallery') {
      const slides = block.content.split('\n').filter(Boolean).map(line => {
        const idx = line.indexOf('|')
        if (idx === -1) return { src: line.trim(), label: '' }
        return { src: line.slice(0, idx).trim(), label: line.slice(idx + 1).trim() }
      })
      return <AutoGallery key={bi} slides={slides} />
    }

    if (block.type === 'decision-cards') {
      const cards = parseDecisionCards(block.content)
      if (!cards.length) return null
      return <DecisionCards key={bi} cards={cards} />
    }

    if (block.type === 'timeline') {
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const pipeIdx = line.indexOf('|')
        return pipeIdx > -1
          ? { title: line.slice(0, pipeIdx).trim(), body: line.slice(pipeIdx + 1).trim() }
          : { title: line.trim(), body: '' }
      })
      return <Timeline key={bi} items={items} />
    }

    if (block.type === 'phase-split') {
      const phases = block.content.split('\n').filter(Boolean).map(line => {
        const pipeIdx = line.indexOf('|')
        return pipeIdx > -1
          ? { label: line.slice(0, pipeIdx).trim(), body: line.slice(pipeIdx + 1).trim() }
          : { label: line.trim(), body: '' }
      })
      function renderPhasebody(text) {
        const parts = text.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((p, i) => {
          const m = p.match(/^\*\*([^*]+)\*\*$/)
          return m ? <strong key={i}>{m[1]}</strong> : p
        })
      }
      return (
        <div key={bi} className="dp-phase-split">
          {phases.map((phase, i) => (
            <div key={i} className="dp-phase-col">
              <div className="dp-phase-pill">{phase.label}</div>
              <p className="dp-phase-body">{renderPhasebody(phase.body)}</p>
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'concepts') {
      const concepts = parseConceptsBlock(block.content)
      if (!concepts.length) return null
      return <ConceptToggle key={bi} concepts={concepts} />
    }

    if (block.type === 'feature-tabs') {
      const tabs = parseFeatureTabsBlock(block.content)
      return <FeatureTabToggle key={bi} tabs={tabs} />
    }

    if (block.type === 'image-tabs') {
      const tabs = block.content.split('\n').filter(Boolean).map(line => {
        const parts = line.split(' | ')
        return { label: parts[0]?.trim(), src: parts[1]?.trim(), caption: parts[2]?.trim() || '' }
      })
      return <ImageTabToggle key={bi} tabs={tabs} />
    }

    if (block.type === 'image-box') {
      const src = block.content.trim()
      return (
        <div key={bi} className="dp-image-box-outer">
          {block.label && <p className="dp-image-box-label">{block.label}</p>}
          <div className="dp-image-box">
            <img src={resolveImgSrc(src)} alt="" className="dp-image-box-img" loading="lazy" />
          </div>
        </div>
      )
    }

    if (block.type === 'feature-screens') {
      const lines = block.content.split('\n').filter(Boolean)
      const [heroLine, ...rest] = lines
      const heroSrc = heroLine?.trim()
      const bullets = rest.filter(l => l.trimStart().startsWith('- ')).map(l => l.replace(/^\s*-\s*/, ''))
      const gridItems = rest.filter(l => !l.trimStart().startsWith('- ')).map(line => {
        const pipeIdx = line.indexOf('|')
        return pipeIdx > -1
          ? { src: line.slice(0, pipeIdx).trim(), label: line.slice(pipeIdx + 1).trim() }
          : { src: line.trim(), label: '' }
      })
      return (
        <div key={bi} className="dp-fscreens">
          <div className="dp-fscreens-hero">
            <img src={resolveImgSrc(heroSrc)} alt="" className="dp-fscreens-img" loading="lazy" />
          </div>
          {bullets.length > 0 && (
            <ul className="dp-fscreens-bullets">
              {bullets.map((b, i) => (
                <li key={i} className="dp-fscreens-bullet">{b}</li>
              ))}
            </ul>
          )}
          {gridItems.length > 0 && (
            <div className="dp-fscreens-grid">
              {gridItems.map((item, i) => (
                <div key={i} className="dp-fscreens-item">
                  <img src={resolveImgSrc(item.src)} alt={item.label} className="dp-fscreens-img" loading="lazy" />
                  {item.label && <p className="dp-fscreens-label">{item.label}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (block.type === 'screengrid') {
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const pipeIdx = line.indexOf('|')
        return pipeIdx > -1
          ? { src: line.slice(0, pipeIdx).trim(), label: line.slice(pipeIdx + 1).trim() }
          : { src: line.trim(), label: '' }
      })
      return (
        <div key={bi} className="dp-screengrid">
          {items.map((item, i) => (
            <div key={i} className="dp-screengrid-item">
              <img src={resolveImgSrc(item.src)} alt={item.label} className="dp-screengrid-img" loading="lazy" />
              {item.label && <p className="dp-screengrid-label">{item.label}</p>}
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'insights') {
      const items = block.content.split('\n').filter(Boolean).map(line => {
        const pipeIdx = line.indexOf('|')
        return pipeIdx > -1
          ? { title: line.slice(0, pipeIdx).trim(), body: line.slice(pipeIdx + 1).trim() }
          : { title: '', body: line.trim() }
      })
      return (
        <div key={bi} className="dp-insights">
          {items.map((item, i) => (
            <div key={i} className="dp-insight" style={{ '--i': i }}>
              <span className="dp-insight-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="dp-insight-content">
                {item.title && <p className="dp-insight-title">{item.title}</p>}
                {item.body  && <p className="dp-insight-body">{item.body}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (block.type === 'img-pair') {
      const [src1, src2] = block.content.split('\n').map(l => l.trim()).filter(Boolean)
      return (
        <div key={bi} className="dp-img-pair">
          <div className="dp-img-pair-cell">
            <img src={resolveImgSrc(src1)} alt="" className="dp-img-pair-img" loading="lazy" />
          </div>
          <div className="dp-img-pair-cell">
            <img src={resolveImgSrc(src2)} alt="" className="dp-img-pair-img" loading="lazy" />
          </div>
        </div>
      )
    }

    if (block.type === 'image-stack') {
      const srcs = block.content.split('\n').map(l => l.trim()).filter(Boolean)
      return (
        <div key={bi} className="dp-image-stack">
          {srcs.map((src, i) => (
            <img key={i} src={resolveImgSrc(src)} alt="" className="dp-image-stack-img" loading="lazy" />
          ))}
        </div>
      )
    }

    if (block.type === 'divider') {
      return <div key={bi} className="dp-section-divider" />
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

    if (block.type === 'dj-features') {
      const features = block.content.split(/^== /m).filter(Boolean).map(section => {
        const lines = section.trim().split('\n')
        const parts = lines[0].split('|').map(s => s.trim())
        const title = parts[0]
        const tag = parts[1] || ''
        const layout = parts[2] || 'left-wide'
        const mockupSrc = parts[3] || ''
        const wideSrc = parts[4] || ''
        const bullets = lines.slice(1).filter(l => l.trimStart().startsWith('- ')).map(l => l.replace(/^\s*-\s*/, ''))
        return { title, tag, layout, mockupSrc, wideSrc, bullets }
      })
      const isVideo = s => s && /\.(mp4|mov|webm)$/i.test(s)
      const DjMedia = ({ src, className }) => isVideo(src)
        ? <video src={resolveImgSrc(src)} className={className} autoPlay muted loop playsInline />
        : <img src={resolveImgSrc(src)} alt="" className={className} loading="lazy" />
      const DjMockup = ({ src }) => (
        <div className="dp-dj-mockup">
          {src
            ? <DjMedia src={src} className="dp-dj-mockup-img" />
            : <div className="dp-dj-mockup-screen" />}
        </div>
      )
      return (
        <div key={bi} className="dp-dj-features">
          {features.map((f, i) => {
            const { title, tag, layout, mockupSrc, wideSrc, bullets } = f
            const desc = (
              <div className="dp-dj-desc">
                <div className="dp-dj-d1">
                  <p className="dp-dj-tag">{tag}</p>
                  <h3 className="dp-dj-title">{title}</h3>
                </div>
                <ul className="dp-dj-bullets">
                  {bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            )
            const imgCol = (
              <div className="dp-dj-img-col">
                <DjMockup src={mockupSrc} />
              </div>
            )
            if (layout === 'full') {
              return (
                <div key={i} className="dp-dj-feature dp-dj-feature--full" style={{ '--i': i }}>
                  {desc}
                  <div className="dp-dj-block-row">
                    {[mockupSrc, wideSrc].map((src, j) => (
                      <div key={j} className="dp-dj-block">
                        {src && <DjMedia src={src} className="dp-dj-block-video" />}
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            if (layout === 'right') {
              return (
                <div key={i} className="dp-dj-feature dp-dj-feature--row" style={{ '--i': i }}>
                  {imgCol}
                  {desc}
                </div>
              )
            }
            return (
              <div key={i} className="dp-dj-feature dp-dj-feature--left-wide" style={{ '--i': i }}>
                <div className="dp-dj-feature--row">
                  {desc}
                  {imgCol}
                </div>
                {wideSrc && (
                  <div className="dp-dj-wide">
                    <img src={resolveImgSrc(wideSrc)} alt="" className="dp-dj-wide-img" loading="lazy" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
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
                  <span className="dp-goal-kicker">Business Goal</span>
                  <p className="dp-goal-value">{needs}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    if (block.type === 'design-sticky') {
      const features = parseDesignSticky(block.content)
      if (!features.length) return null
      return <DesignSticky key={bi} features={features} />
    }

    if (block.type === 'challenge-cards') {
      const challenges = parseChallengeCards(block.content)
      if (!challenges.length) return null
      return <ChallengeCards key={bi} challenges={challenges} />
    }

    if (block.type === 'research-findings') {
      const findings = []
      let current = null
      for (const line of block.content.split('\n')) {
        const t = line.trim()
        if (t.startsWith('== ')) {
          if (current) findings.push(current)
          const parts = t.slice(3).split('|').map(s => s.trim())
          current = { num: parts[0], layout: parts[1] || 'full', title: '', body: '', img: '', caption: '' }
        } else if (current && !current.title && t) {
          current.title = t
        } else if (current && current.title && !current.body && t) {
          current.body = t
        } else if (current && current.body && !current.img && t) {
          const imgParts = t.split('|').map(s => s.trim())
          current.img = imgParts[0]
          current.caption = imgParts[1] || ''
        }
      }
      if (current) findings.push(current)
      return (
        <div key={bi} className="dp-research-findings">
          {findings.map((f, i) => {
            if (f.layout === 'split') {
              return (
                <div key={i} className="dp-rf-finding dp-rf-finding--split">
                  <div className="dp-rf-left">
                    <img src={resolveImgSrc(f.img)} alt={f.caption || ''} className="dp-rf-img" loading="lazy" />
                    {f.caption && <p className="dp-rf-caption">{f.caption}</p>}
                  </div>
                  <div className="dp-rf-right">
                    <span className="dp-rf-num">{f.num}</span>
                    <h4 className="dp-rf-title">{f.title}</h4>
                    <p className="dp-rf-body">{f.body}</p>
                  </div>
                </div>
              )
            }
            return (
              <div key={i} className="dp-rf-finding dp-rf-finding--full">
                <span className="dp-rf-num">{f.num}</span>
                <h4 className="dp-rf-title">{f.title}</h4>
                <p className="dp-rf-body">{f.body}</p>
                {f.img && <img src={resolveImgSrc(f.img)} alt="" className="dp-rf-img dp-rf-img--full" loading="lazy" />}
              </div>
            )
          })}
        </div>
      )
    }

    if (block.type === 'image-aside') {
      const pipIdx = block.label.indexOf('|')
      const imgSrc   = pipIdx > -1 ? block.label.slice(0, pipIdx).trim() : block.label.trim()
      const imgLabel = pipIdx > -1 ? block.label.slice(pipIdx + 1).trim() : ''
      return (
        <div key={bi} className="dp-image-aside">
          <div className="dp-image-aside-text">
            <ReactMarkdown components={mdComponents}>{block.content}</ReactMarkdown>
          </div>
          <figure className="dp-image-aside-fig">
            <img src={resolveImgSrc(imgSrc)} alt={imgLabel || ''} className="dp-image-aside-img" loading="lazy" />
            {imgLabel && <figcaption className="dp-image-aside-label">{imgLabel}</figcaption>}
          </figure>
        </div>
      )
    }

    if (block.type === 'youtube') {
      const raw = block.content.trim()
      const ytMatch = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/)
      const videoId = ytMatch ? ytMatch[1] : raw
      return (
        <div key={bi} className="dp-youtube">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="DoryVR demo"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
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
    document.querySelectorAll('.dp-highlight').forEach(el => {
      if (!el.closest('.dp-cc-wrapper')) obs.observe(el)
    })
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

  const meta             = parseMetaTable(parsed.sections['Project Meta'])
  const visibleNavItems  = NAV_ITEMS.filter(({ id }) => !!clean(getSectionContent(id, parsed.sections)))
  const activeVisibleIdx = visibleNavItems.findIndex(({ id }) => id === activeSection)

  return (
    <div className="dp-page" data-slug={slug}>

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
              style={{ top: `${activeVisibleIdx * 48 + 21}px` }}
            />
            {visibleNavItems.map(({ id, label }) => (
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
              ? <img src={COVER_IMAGES[slug]} alt={`${parsed.title} cover`} className="dp-hero-img" loading="eager" />
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
            <button
              className="pill ghost"
              onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
            >
              Back to top ↑
            </button>
            {NEXT_SLUG[slug] && (
              <div className="about-cta-pair">
                <Link to={NEXT_SLUG[slug]} className="pill filled">VIEW NEXT CASE STUDY</Link>
                <Link to={NEXT_SLUG[slug]} className="pill icon-only">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                </Link>
              </div>
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
