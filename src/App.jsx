import { useState, useRef, useCallback } from 'react'
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

  const handlePillClick = useCallback((text) => {
    if (text === 'MY WORK') {
      document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' })
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
          <img src="https://www.figma.com/api/mcp/asset/78fcece9-d821-46e7-8439-1e84903982aa" alt="Menghan" width="24" height="24" />
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
                  <p className="hero-line-1">Hi, I&apos;m <span className="serif">Menghan</span> —</p>
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
                <button className="pill ghost" onClick={() => handlePillClick('back to homepage')}>back to homepage</button>
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
