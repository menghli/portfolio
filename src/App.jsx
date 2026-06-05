import { useState, useRef, useCallback, useEffect } from 'react'
import TextType from './components/TextType/TextType.jsx'

const TYPEWRITER_SPEED = 18

function typewriter(el, text, speed, onDone) {
  let i = 0
  const id = setInterval(() => {
    el.textContent += text[i]
    i++
    if (i >= text.length) {
      clearInterval(id)
      if (onDone) onDone()
    }
  }, speed)
}

const HERO_TEXTS = [
  'Mixed Method Researcher',
  'UX/Product Designer',
  'Problem Solver',
  'Market Research Analyst',
]

function App() {
  const [isChat, setIsChat] = useState(false)
  const threadRef = useRef(null)
  const lerpTargetRef = useRef(0)

  const resetChat = useCallback(() => {
    setIsChat(false)
    if (threadRef.current) threadRef.current.innerHTML = ''
  }, [])

  const enterChat = useCallback((pillText) => {
    if (isChat) return
    setIsChat(true)
    const thread = threadRef.current
    const msg = document.createElement('div')
    msg.className = 'chat-msg chat-msg--you'
    msg.innerHTML =
      '<div class="chat-avatar"></div>' +
      '<div class="chat-body">' +
        '<span class="chat-label">YOU</span>' +
        '<p class="chat-text"></p>' +
      '</div>'
    thread.appendChild(msg)
    const textEl = msg.querySelector('.chat-text')
    const handler = (e) => {
      if (e.target === thread && e.propertyName === 'opacity') {
        thread.removeEventListener('transitionend', handler)
        typewriter(textEl, pillText, TYPEWRITER_SPEED, null)
      }
    }
    thread.addEventListener('transitionend', handler)
  }, [isChat])

  useEffect(() => {
    const EASE = 0.1
    let currentY = window.scrollY
    lerpTargetRef.current = window.scrollY
    let rafId = null

    const onWheel = e => {
      e.preventDefault()
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      lerpTargetRef.current = Math.max(0, Math.min(maxScroll, lerpTargetRef.current + e.deltaY))
    }

    const tick = () => {
      const target = lerpTargetRef.current
      currentY += (target - currentY) * EASE
      if (Math.abs(target - currentY) < 0.5) currentY = target
      window.scrollTo(0, currentY)
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const MAX_BLUR = 18
    const FADE_START = 0.4
    const FADE_END = 0.6
    const SOLID_BG = '#F7F6F4'

    const overlays = [
      document.querySelector('.section-design'),
      document.querySelector('.section-research'),
    ].filter(Boolean)

    const update = () => {
      const vh = window.innerHeight
      overlays.forEach(el => {
        const top = el.getBoundingClientRect().top
        if (top <= 2) {
          el.style.background = SOLID_BG
          el.style.backdropFilter = 'none'
          el.style.webkitBackdropFilter = 'none'
        } else if (top < vh) {
          const progress = 1 - top / vh
          if (progress >= FADE_END) {
            el.style.background = SOLID_BG
            el.style.backdropFilter = 'none'
            el.style.webkitBackdropFilter = 'none'
          } else if (progress >= FADE_START) {
            // crossfade: blur fades out, solid color fades in
            const t = (progress - FADE_START) / (FADE_END - FADE_START)
            const blur = MAX_BLUR * (1 - t)
            el.style.background = `rgba(247, 246, 244, ${t.toFixed(3)})`
            el.style.backdropFilter = `blur(${blur.toFixed(1)}px)`
            el.style.webkitBackdropFilter = `blur(${blur.toFixed(1)}px)`
          } else {
            const blur = (progress / FADE_START) * MAX_BLUR
            el.style.background = 'transparent'
            el.style.backdropFilter = `blur(${blur.toFixed(1)}px)`
            el.style.webkitBackdropFilter = `blur(${blur.toFixed(1)}px)`
          }
        } else {
          el.style.background = 'transparent'
          el.style.backdropFilter = 'none'
          el.style.webkitBackdropFilter = 'none'
        }
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const handlePillClick = useCallback((text) => {
    if (text === 'MY WORK') {
      const el = document.querySelector('#projects')
      if (el) lerpTargetRef.current = el.getBoundingClientRect().top + window.scrollY
      return
    }
    if (text.toLowerCase() === 'back to homepage') {
      resetChat()
      return
    }
    enterChat(text)
  }, [enterChat, resetChat])

  const ArrowSvg = ({ deg }) => (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" style={deg ? { transform: `rotate(${deg}deg)` } : undefined}>
      <path d="M3 0V8M3 8L1 6M3 8L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter"/>
    </svg>
  )

  return (
    <>
      {/* TickerBar */}
      <div className="ticker">
        <div className="ticker-track">
          <span>Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · </span>
          <span aria-hidden="true">Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Menghan">
            <g transform="translate(4.36, 2.18)">
              <path d="M11.648 14.8189C11.4386 14.8189 11.2582 14.7258 11.1069 14.5396C10.9673 14.3535 10.8975 14.0276 10.8975 13.5622C10.8975 13.2945 10.9499 12.9804 11.0546 12.6196C11.2873 11.8865 11.5259 11.1011 11.7702 10.2633C12.0262 9.42546 12.2648 8.57018 12.4859 7.69746C12.7186 6.82473 12.9048 5.98109 13.0444 5.16655C13.184 4.34036 13.2539 3.584 13.2539 2.89745C13.2539 2.66473 13.2422 2.43782 13.2189 2.21673C13.2073 1.99564 13.1782 1.78618 13.1317 1.58836C11.9564 2.70545 10.8684 4.224 9.86767 6.144C8.87858 8.05236 7.97676 10.2749 7.16222 12.8116C7.02258 13.1956 6.84804 13.4633 6.63858 13.6145C6.42913 13.7658 6.23131 13.8415 6.04513 13.8415C5.88222 13.8415 5.72513 13.7775 5.57386 13.6495C5.42258 13.5098 5.34695 13.3004 5.34695 13.0211C5.34695 12.8349 5.39349 12.5731 5.48658 12.2356C5.57967 11.8865 5.74258 11.5665 5.97531 11.2756C6.10331 10.5076 6.20804 9.69309 6.28949 8.832C6.38258 7.97091 6.42913 7.17382 6.42913 6.44073C6.42913 6.10327 6.41167 5.78909 6.37676 5.49818C6.35349 5.19564 6.31276 4.93382 6.25458 4.71273C5.64949 5.35273 5.08513 6.15564 4.56149 7.12146C4.04949 8.07564 3.59567 9.10546 3.20004 10.2109C2.8044 11.3047 2.47276 12.3753 2.20513 13.4225C1.99567 14.1789 1.65822 14.5571 1.19276 14.5571C1.00658 14.5571 0.849491 14.4582 0.721491 14.2604C0.605127 14.0625 0.546945 13.7658 0.546945 13.3702C0.546945 12.9862 0.640036 12.4684 0.826218 11.8167C1.0124 11.1651 1.26258 10.4495 1.57676 9.66982C1.90258 8.89018 2.26331 8.11636 2.65895 7.34836C3.06622 6.56873 3.48513 5.85891 3.91567 5.21891C4.35785 4.56727 4.7884 4.04364 5.20731 3.648C5.62622 3.25236 6.0044 3.05455 6.34186 3.05455C6.56295 3.05455 6.76076 3.09527 6.93531 3.17673C7.10986 3.25818 7.26113 3.42691 7.38913 3.68291C7.51713 3.92727 7.61022 4.30546 7.6684 4.81745C7.73822 5.31782 7.77313 5.98691 7.77313 6.82473C7.77313 6.976 7.77313 7.15055 7.77313 7.34836C8.11058 6.41745 8.5004 5.51564 8.94258 4.64291C9.3964 3.75855 9.87349 2.96727 10.3739 2.26909C10.8742 1.57091 11.3746 1.01818 11.8749 0.61091C12.3753 0.203637 12.8466 0 13.2888 0C13.7891 0 14.1964 0.273455 14.5106 0.820364C14.8248 1.35564 14.9819 2.19927 14.9819 3.35127C14.9819 4.44509 14.8946 5.50982 14.72 6.54546C14.5455 7.58109 14.3244 8.55855 14.0568 9.47782C13.8008 10.3971 13.5331 11.2349 13.2539 11.9913C12.9862 12.736 12.7535 13.376 12.5557 13.9113C12.4277 14.2371 12.2939 14.4698 12.1542 14.6095C12.0146 14.7491 11.8459 14.8189 11.648 14.8189Z" fill="url(#logo-grad-m)"/>
              <circle cx="1.81819" cy="17.9695" r="1.81818" fill="url(#logo-grad-d1)"/>
              <circle cx="10.5455" cy="17.9695" r="1.81818" fill="url(#logo-grad-d2)"/>
            </g>
            <defs>
              <linearGradient id="logo-grad-m" x1="6.247" y1="3.543" x2="19.703" y2="17.389" gradientUnits="userSpaceOnUse">
                <stop stopColor="#487089"/>
                <stop offset="1" stopColor="#88D8C0"/>
              </linearGradient>
              <linearGradient id="logo-grad-d1" x1="4.698" y1="18.666" x2="7.996" y2="22.15" gradientUnits="userSpaceOnUse">
                <stop stopColor="#487089"/>
                <stop offset="1" stopColor="#88D8C0"/>
              </linearGradient>
              <linearGradient id="logo-grad-d2" x1="13.425" y1="18.666" x2="16.723" y2="22.15" gradientUnits="userSpaceOnUse">
                <stop stopColor="#487089"/>
                <stop offset="1" stopColor="#88D8C0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="nav-links">
          <a href="#projects">PROJECTS</a>
          <a href="#about">ABOUT</a>
          <a href="#">LINKEDIN</a>
        </div>
      </nav>

      {/* Sticky stack: Hero + Design + Research */}
      <div className="sticky-stack">

        {/* Hero */}
        <section className={`hero${isChat ? ' is-chat' : ''}`}>
          <div className="hero-content">
            <div className="hero-top">
              <div className="hero-text">
                <div className="hero-headline">
                  <p className="hero-line-1">Hi, I&apos;m <span className="serif">Menghan</span></p>
                  <TextType
                    as="p"
                    className="hero-line-2 serif"
                    text={HERO_TEXTS}
                    loop={true}
                    typingSpeed={70}
                    deletingSpeed={60}
                    pauseDuration={1800}
                    showCursor={true}
                    cursorCharacter="_"
                  />
                </div>
                <p className="hero-sub">I research and design meaningful, enjoyable experiences, driven by data and grounded in empathy. Currently Design @ Amazon</p>
              </div>
              <div className="chat-thread" ref={threadRef} aria-live="polite"></div>
            </div>

            <div className="hero-interactive">
              <div className="hero-pills">
                <button className="pill ghost" onClick={() => handlePillClick('MY WORK')}>
                  MY WORK
                  <svg className="pill-icon" width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M3 0V8M3 8L1 6M3 8L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                </button>
                <button className="pill ghost" onClick={() => handlePillClick('What researcher are you?')}>What researcher are you?</button>
                <button className="pill ghost" onClick={() => handlePillClick('Tell me about you')}>Tell me about you</button>
                <button className="pill ghost" onClick={() => handlePillClick('Book a Chat with me!')}>Book a Chat with me!</button>
                <button className="pill ghost" onClick={() => handlePillClick('What do you Design?')}>What do you Design?</button>
                <button className="pill ghost" onClick={() => handlePillClick('How do you use AI in work?')}>How do you use AI in work?</button>
                <button className="pill ghost" onClick={() => handlePillClick('back to homepage')}>RESTART</button>
              </div>
              <div className="chat-bar">
                <div className="chat-bar-left">
                  <span className="chat-cursor">&gt;_</span>
                  <span className="chat-hint">Ask me anything...</span>
                </div>
                <button className="chat-send">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M1 5H14M14 5L10 1M14 5L10 9" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Design Projects */}
        <section className="section-design" id="projects">
          <div className="section-divider" />
          <div className="section-head">
            <div className="section-head-left">
              <h2 className="h2">Design Projects</h2>
              <button className="pill ghost">
                Skip to Research
                <svg className="pill-icon" width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M3 0V8M3 8L1 6M3 8L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </button>
            </div>
            <button className="pill ghost pagination-pill">
              <ArrowSvg deg={90} />
              1/4
              <ArrowSvg deg={-90} />
            </button>
          </div>
          <div className="design-card">
            <div className="design-card-image"></div>
            <div className="design-card-info">
              <div className="design-card-text">
                <p className="card-tag">UX Design | Web Audit | Usability Testing</p>
                <h3 className="card-title">Redesigning the Experiential Learning of Interview Skills through Role-play</h3>
                <p className="card-desc">Pirate ipsum aye chandler gangway driver chain topgallant poop gold sail black. Pirate ipsum aye chandler gangway driver chain topgallant poop gold sail black.</p>
              </div>
              <div className="card-cta">
                <button className="btn-arrow"><ArrowSvg deg={90} /></button>
                <button className="pill filled">Read case study</button>
                <button className="btn-arrow"><ArrowSvg deg={-90} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Research Projects */}
        <section className="section-research" id="research">
          <div className="section-divider" />
          <div className="section-head">
            <div className="section-head-left">
              <h2 className="h2">Research Projects</h2>
              <button className="pill ghost">
                Checkout Design
                <svg className="pill-icon" width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ transform: 'rotate(180deg)' }}>
                  <path d="M3 0V8M3 8L1 6M3 8L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="research-grid">
            <div className="r-card r-card--large">
              <p className="r-card-title">Designing for Trust</p>
              <div className="r-card-footer">
                <button className="pill ghost thick">Research</button>
                <button className="pill filled">OPEN PROJECT</button>
              </div>
            </div>
            <div className="r-cards-stack">
              <div className="r-card r-card--small">
                <div className="r-card-footer">
                  <button className="pill ghost thick">Research</button>
                </div>
              </div>
              <div className="r-card r-card--small">
                <div className="r-card-footer">
                  <button className="pill ghost thick">Research</button>
                </div>
              </div>
            </div>
            <div className="r-card r-card--arch">
              <div className="r-card-footer">
                <button className="pill ghost thick">Research</button>
                <button className="pill filled">OPEN PROJECT</button>
              </div>
            </div>
          </div>
        </section>

      </div>{/* end .sticky-stack */}

      {/* Testimonials */}
      <section className="section-testimonials">
        <div className="testimonials-header">
          <h2 className="h2">How is it like to work with me?</h2>
        </div>
        <div className="testimonials-body">
          <div className="testimonial-glow"></div>
          <button className="carousel-btn">←</button>
          <div className="testimonial-content">
            <blockquote className="testimonial-quote">"Working with Menghan is rare — she brings both sharp strategic thinking and the craft to execute it. She makes every team around her better."</blockquote>
            <p className="testimonial-attr">SARAH CHEN, SENIOR PM · MICROSOFT</p>
          </div>
          <button className="carousel-btn">→</button>
        </div>
      </section>

      {/* About Me */}
      <section className="section-about" id="about">
        <div className="about-head">
          <div className="about-head-left">
            <h2 className="h2">About Me</h2>
            <div className="about-ctas">
              <button className="pill ghost">Learn More</button>
              <button className="pill filled">Read case study</button>
              <button className="pill icon-only pill--white">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="about-grid">
          <div className="about-col about-col--border">
            <span className="col-label">01 — BACKGROUND</span>
            <div className="col-img col-img--taupe"></div>
            <h3 className="col-title">Title Title Title Title Title Title Title Title Title Title</h3>
            <p className="col-body">Studied at UW. Previously at [Role, Company]. Believe great design starts with understanding people.</p>
          </div>
          <div className="about-col about-col--border">
            <span className="col-label">02 — DESIGN APPROACH</span>
            <div className="col-img col-img--light"></div>
            <h3 className="col-title">Title Title Title Title Title Title Title Title Title Title</h3>
            <p className="col-body">Studied at UW. Previously at [Role, Company]. Believe great design starts with understanding people.</p>
          </div>
          <div className="about-col about-col--border">
            <span className="col-label">03 — OUTSIDE WORK</span>
            <div className="col-img col-img--warm"></div>
            <h3 className="col-title">Title Title Title Title Title Title Title Title Title Title</h3>
            <p className="col-body">Studied at UW. Previously at [Role, Company]. Believe great design starts with understanding people.</p>
          </div>
          <div className="about-col">
            <span className="col-label">04 — MUSIC</span>
            <div className="col-img col-img--cool"></div>
            <h3 className="col-title">Title Title Title Title Title Title Title Title Title Title</h3>
            <p className="col-body">Studied at UW. Previously at [Role, Company]. Believe great design starts with understanding people.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-credit">Created by MENGHAN</span>
        <div className="nav-links">
          <a href="#projects">PROJECTS</a>
          <a href="#about">ABOUT</a>
          <a href="#">LINKEDIN</a>
        </div>
      </footer>
    </>
  )
}

export default App
