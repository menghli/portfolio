import { useState, useRef, useCallback, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import TextType from './components/TextType/TextType.jsx'
import LogoLoop from './components/LogoLoop/LogoLoop.jsx'
import CustomCursor from './components/CustomCursor/CustomCursor.jsx'
import ResearchPage from './pages/ResearchPage.jsx'
import DesignPage from './pages/DesignPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import avatar1Img       from './img/homepage/avatar1.png'
import avatar2Img       from './img/homepage/avatar2.png'
import amazonSmall      from './img/homepage/Amazon-small.svg'
import expertvoiceSmall from './img/homepage/ExpertVoice-small.svg'
import negotiumSmall    from './img/homepage/Negotium-small.svg'
import moomooSmall      from './img/homepage/Moomoo-small.svg'
import pinMiSmall       from './img/homepage/Pin-MI-small.svg'
import dubjamSmall      from './img/homepage/Dubjam-small.svg'
import doryVRSmall      from './img/homepage/DoryVR-small.svg'
import logo1            from './img/homepage/logo1.svg'
import logo2            from './img/homepage/logo2.svg'
import logo3            from './img/homepage/logo3.svg'
import logo4            from './img/homepage/logo4.svg'
import logo5            from './img/homepage/logo5.svg'
import logo6            from './img/homepage/logo6.svg'
import chatMd           from './content/chat-responses.md?raw'
import backgroundImg    from './img/homepage/background.svg'
import designImg        from './img/homepage/design.png'
import outsideWorkImg   from './img/homepage/outside-of-work.avif'

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

// ── Parse chat-responses.md ────────────────────────────────────────────────
function parseChatResponses(raw) {
  const responses = {}
  const sections = raw.split(/\n## /)
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i]
    const nl = section.indexOf('\n')
    const heading = section.slice(0, nl).trim()
    const body = section.slice(nl).replace(/\n---\s*$/, '').trim()
    responses[heading] = body
  }
  return responses
}

const CHAT_RESPONSES = parseChatResponses(chatMd)

function parseInlineMarkdown(text) {
  return text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_, label, href) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer" class="chat-link">${label}</a>`
  )
}

// Maps each pill's onClick text to its markdown heading
const PILL_RESPONSE_KEYS = {
  'What researcher are you?':  'WHAT RESEARCHER ARE YOU?',
  'Tell me about you':         'TELL ME ABOUT YOU',
  'Book a Chat with me!':      'Book a Chat with me!',
  'What do you Design?':       'WHAT DO YOU DESIGN?',
  'How do you use AI in work?':'HOW DO YOU USE AI IN YOUR WORK?',
}

const PILLS_WITH_CARDS = new Set(['What researcher are you?', 'What do you Design?'])

const CHAT_PROJECT_CARDS = {
  'What researcher are you?': [
    { img: amazonSmall,      title: 'PeripheralPulse Research' },
    { img: expertvoiceSmall, title: 'ExpertVoice' },
    { img: negotiumSmall,    title: 'Negotium' },
    { img: moomooSmall,      title: 'Moomoo Earning Report' },
  ],
  'What do you Design?': [
    { img: pinMiSmall,  title: 'Pin-MI' },
    { img: dubjamSmall, title: 'DubJam' },
    { img: doryVRSmall, title: 'DoryVR' },
  ],
}

const LOGOS = [
  { src: logo1, alt: 'Logo 1' },
  { src: logo2, alt: 'Logo 2' },
  { src: logo3, alt: 'Logo 3' },
  { src: logo4, alt: 'Logo 4' },
  { src: logo5, alt: 'Logo 5' },
  { src: logo6, alt: 'Logo 6' },
]

const FALLBACK_RESPONSES = [
  "That's a great question! I'm Menghan's AI assistant and can only answer questions about her work and experience. I'll make sure she sees this though — feel free to also reach out directly on LinkedIn!",
  "Hmm, I'm not sure I have an answer for that one. I'm best at talking about Menghan's projects and background. I'll pass your question along to her!",
  "Thanks for asking! I'm a limited version of Menghan here to share her work — for anything outside my knowledge, I'll let her know you stopped by.",
]

const DESIGN_PROJECTS = [
  { title: 'Redesigning the Experiential Learning of Interview Skills through Role-play', img: pinMiSmall,  slug: '/design/pin-mi'  },
  { title: 'DubJam: How I Led a 0-to-1 Design to Foster Local Music Community',          img: dubjamSmall, slug: '/design/dubjam'  },
  { title: 'DoryVR: Data Storytelling and Learning Tool in Mixed Reality',                img: doryVRSmall, slug: '/design/dory-vr' },
]

const HERO_TEXTS = [
  'Mixed Method Researcher',
  'UX/Product Designer',
  'Problem Solver',
  'Market Research Analyst',
]


function HomePage() {
  const [isChat, setIsChat] = useState(false)
  const threadRef = useRef(null)
  const inputRef = useRef(null)
  const lerpTargetRef = useRef(0)
  const chatInitiatedRef = useRef(false)

  const resetChat = useCallback(() => {
    setIsChat(false)
    chatInitiatedRef.current = false
    if (threadRef.current) threadRef.current.innerHTML = ''
  }, [])

  const enterChat = useCallback((pillText) => {
    setIsChat(true)
    const thread = threadRef.current

    const addMessages = () => {
      // YOU bubble
      const youMsg = document.createElement('div')
      youMsg.className = 'chat-msg chat-msg--you'
      youMsg.innerHTML =
        `<img class="chat-avatar" src="${avatar2Img}" alt="You" />` +
        '<div class="chat-body">' +
          '<span class="chat-label">YOU</span>' +
          '<p class="chat-text"></p>' +
        '</div>'
      thread.appendChild(youMsg)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        youMsg.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }))

      const textEl = youMsg.querySelector('.chat-text')
      const displayText = pillText.charAt(0).toUpperCase() + pillText.slice(1).toLowerCase()
      typewriter(textEl, displayText, TYPEWRITER_SPEED, () => {
        const key = PILL_RESPONSE_KEYS[pillText]
        const responseText = key ? CHAT_RESPONSES[key] : null
        if (!responseText) return

        // 700ms pause, then MENGHAN shell + typing indicator fade in
        setTimeout(() => {
          const menghanMsg = document.createElement('div')
          menghanMsg.className = 'chat-msg'
          menghanMsg.style.opacity = '0'
          menghanMsg.style.transition = 'opacity 300ms ease'
          menghanMsg.innerHTML =
            `<img class="chat-avatar" src="${avatar1Img}" alt="Menghan" />` +
            '<div class="chat-body">' +
              '<span class="chat-label chat-label--menghan">MENGHAN</span>' +
              '<span class="chat-typing">_</span>' +
            '</div>'
          thread.appendChild(menghanMsg)
          menghanMsg.scrollIntoView({ behavior: 'smooth', block: 'start' })

          requestAnimationFrame(() => requestAnimationFrame(() => {
            menghanMsg.style.opacity = '1'
          }))

          // 1.5s later: swap typing indicator for full response
          setTimeout(() => {
            const typingEl = menghanMsg.querySelector('.chat-typing')
            if (!typingEl) return

            const showCards = PILLS_WITH_CARDS.has(pillText)
            const paragraphs = responseText
              .split('\n\n')
              .filter(p => p.trim())
              .map(p => `<p class="chat-text">${parseInlineMarkdown(p.trim())}</p>`)
              .join('')
            const cards = showCards ? (CHAT_PROJECT_CARDS[pillText] || []) : []
            const cardsHtml = cards.map(card =>
              `<div class="chat-project-card">` +
                `<img src="${card.img}" alt="" class="chat-project-img" />` +
                `<p class="chat-project-title">${card.title}</p>` +
              `</div>`
            ).join('')

            const content = document.createElement('div')
            content.className = 'chat-response-content'
            content.style.opacity = '0'
            content.style.transform = 'translateY(10px)'
            content.style.transition = 'opacity 400ms ease, transform 400ms ease'
            content.innerHTML =
              `<div class="chat-response-text">${paragraphs}</div>` +
              (cards.length ? `<div class="chat-project-row">${cardsHtml}</div>` : '')

            typingEl.replaceWith(content)

            requestAnimationFrame(() => requestAnimationFrame(() => {
              content.style.opacity = '1'
              content.style.transform = 'translateY(0)'
              menghanMsg.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }))
          }, 1500)
        }, 700)
      })
    }

    if (!chatInitiatedRef.current) {
      chatInitiatedRef.current = true
      const onTransition = e => {
        if (e.target === thread && e.propertyName === 'opacity') {
          thread.removeEventListener('transitionend', onTransition)
          addMessages()
        }
      }
      thread.addEventListener('transitionend', onTransition)
    } else {
      addMessages()
    }
  }, [])

  useEffect(() => {
    const EASE = 0.1
    let currentY = window.scrollY
    lerpTargetRef.current = window.scrollY
    let rafId = null

    const onWheel = e => {
      // Let chat thread scroll independently
      const thread = threadRef.current
      if (thread && thread.contains(e.target)) {
        const canScrollDown = thread.scrollTop < thread.scrollHeight - thread.clientHeight - 1
        const canScrollUp = thread.scrollTop > 0
        if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
          e.preventDefault()
          thread.scrollTop += e.deltaY
          return
        }
      }

      const cardsRow = document.querySelector('.design-cards-row')
      const section = document.querySelector('.section-design')
      if (cardsRow && section) {
        const rect = section.getBoundingClientRect()
        const researchRect = document.querySelector('.section-research')?.getBoundingClientRect()
        const researchOverlaying = researchRect && researchRect.top <= 0
        const inSection = rect.top <= 0 && rect.bottom > 0 && !researchOverlaying
        if (inSection) {
          const maxScroll = cardsRow.scrollWidth - cardsRow.clientWidth
          const atEnd = cardsRow.scrollLeft >= maxScroll - 1
          const atStart = cardsRow.scrollLeft <= 0
          if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
            e.preventDefault()
            cardsRow.scrollLeft += e.deltaY
            return
          }
        }
      }
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
      lerpTargetRef.current = window.innerHeight
      return
    }
    if (text.toLowerCase() === 'back to homepage') {
      resetChat()
      return
    }
    enterChat(text)
  }, [enterChat, resetChat])

  const handleFreeTextSubmit = useCallback(() => {
    const input = inputRef.current
    if (!input) return
    const text = input.value.trim()
    if (!text) return
    input.value = ''
    input.blur()

    const thread = threadRef.current

    const addMessages = () => {
      const youMsg = document.createElement('div')
      youMsg.className = 'chat-msg chat-msg--you'
      youMsg.innerHTML =
        `<img class="chat-avatar" src="${avatar2Img}" alt="You" />` +
        '<div class="chat-body">' +
          '<span class="chat-label">YOU</span>' +
          '<p class="chat-text"></p>' +
        '</div>'
      thread.appendChild(youMsg)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        youMsg.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }))

      const textEl = youMsg.querySelector('.chat-text')
      typewriter(textEl, text, TYPEWRITER_SPEED, () => {
        const responseText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]

        setTimeout(() => {
          const menghanMsg = document.createElement('div')
          menghanMsg.className = 'chat-msg'
          menghanMsg.style.opacity = '0'
          menghanMsg.style.transition = 'opacity 300ms ease'
          menghanMsg.innerHTML =
            `<img class="chat-avatar" src="${avatar1Img}" alt="Menghan" />` +
            '<div class="chat-body">' +
              '<span class="chat-label chat-label--menghan">MENGHAN</span>' +
              '<span class="chat-typing">_</span>' +
            '</div>'
          thread.appendChild(menghanMsg)
          menghanMsg.scrollIntoView({ behavior: 'smooth', block: 'start' })

          requestAnimationFrame(() => requestAnimationFrame(() => {
            menghanMsg.style.opacity = '1'
          }))

          setTimeout(() => {
            const typingEl = menghanMsg.querySelector('.chat-typing')
            if (!typingEl) return

            const content = document.createElement('div')
            content.className = 'chat-response-content'
            content.style.opacity = '0'
            content.style.transform = 'translateY(10px)'
            content.style.transition = 'opacity 400ms ease, transform 400ms ease'
            content.innerHTML = `<div class="chat-response-text"><p class="chat-text">${responseText}</p></div>`

            typingEl.replaceWith(content)

            requestAnimationFrame(() => requestAnimationFrame(() => {
              content.style.opacity = '1'
              content.style.transform = 'translateY(0)'
              menghanMsg.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }))
          }, 1500)
        }, 700)
      })
    }

    if (!chatInitiatedRef.current) {
      chatInitiatedRef.current = true
      setIsChat(true)
      const onTransition = e => {
        if (e.target === thread && e.propertyName === 'opacity') {
          thread.removeEventListener('transitionend', onTransition)
          addMessages()
        }
      }
      thread.addEventListener('transitionend', onTransition)
    } else {
      addMessages()
    }
  }, [])

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
          <Link to="/">
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
          </Link>
        </div>
        <div className="nav-links">
          <a href="#projects">PROJECTS</a>
          <Link to="/about">ABOUT</Link>
          <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
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
                <span className="chat-cursor">&gt;_</span>
                <input
                  ref={inputRef}
                  className="chat-input"
                  type="text"
                  placeholder="Ask me anything..."
                  maxLength={200}
                  onKeyDown={e => { if (e.key === 'Enter') handleFreeTextSubmit() }}
                />
                <button className="chat-send" onClick={handleFreeTextSubmit}>
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
              <button className="pill ghost" onClick={() => {
                lerpTargetRef.current = window.innerHeight * 2
              }}>
                Skip to Research
                <svg className="pill-icon" width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M3 0V8M3 8L1 6M3 8L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="design-cards-row">
            {DESIGN_PROJECTS.map((project, i) => (
              <div className="project-card-wrap" key={i}>
                <Link to={project.slug} className="project-card">
                  <img src={project.img} alt="" className="project-card-img" />
                </Link>
                <p className="project-card-title">{project.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Research Projects */}
        <section className="section-research" id="research">
          <div className="section-divider" />
          <div className="section-head">
            <div className="section-head-left">
              <h2 className="h2">Research Projects</h2>
              <button className="pill ghost" onClick={() => {
                lerpTargetRef.current = window.innerHeight
              }}>
                Checkout Design
                <svg className="pill-icon" width="6" height="10" viewBox="0 0 6 10" fill="none" style={{ transform: 'rotate(180deg)' }}>
                  <path d="M3 0V8M3 8L1 6M3 8L5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="research-grid">
            <div className="r-card r-card--large r-card--light-text">
              <img src={amazonSmall} alt="" className="r-card-bg" />
              <div className="r-card-overlay r-card-overlay--spread">
                <p className="r-card-title r-card-title--tr">Amazon IT: PeripheralPulse Research</p>
                <Link to="/research/amazon" className="pill ghost">OPEN PROJECT</Link>
              </div>
            </div>
            <div className="r-cards-stack">
              <div className="r-card r-card--small">
                <img src={expertvoiceSmall} alt="" className="r-card-bg" />
                <div className="r-card-overlay r-card-overlay--spread">
                  <p className="r-card-title r-card-title--tr">ExpertVoice</p>
                  <Link to="/research/expertvoice" className="pill ghost">OPEN PROJECT</Link>
                </div>
              </div>
              <div className="r-card r-card--small r-card--light-text">
                <img src={negotiumSmall} alt="" className="r-card-bg" />
                <div className="r-card-overlay r-card-overlay--spread">
                  <p className="r-card-title r-card-title--tr">Negotium</p>
                  <Link to="/research/negotium" className="pill ghost">OPEN PROJECT</Link>
                </div>
              </div>
            </div>
            <div className="r-card r-card--arch r-card--light-text r-card--gradient-hover">
              <img src={moomooSmall} alt="" className="r-card-bg" />
              <div className="r-card-overlay">
                <p className="r-card-title">Testing Moomoo Earning Report</p>
                <Link to="/research/moomoo" className="pill ghost">OPEN PROJECT</Link>
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
          <div className="testimonial-glow" />
          <div className="testimonial-content">
            <blockquote className="testimonial-quote">
              I am a mixed-method UX researcher and product designer based in Seattle. I build thoughtful digital experiences across research and design, with contributions at Amazon, Work 365, ExpertVoice, and more.
            </blockquote>
          </div>
        </div>
        <div className="logo-marquee-wrapper">
          <LogoLoop
            logos={LOGOS}
            speed={55}
            direction="left"
            logoHeight={56}
            gap={72}
            hoverSpeed={0}
            fadeOut
            fadeOutColor="#F7F6F4"
            ariaLabel="Companies I've worked with"
          />
        </div>
        <div className="testimonials-bottom-line" />
      </section>

      {/* About Me */}
      <section className="section-about" id="about">
        <div className="about-head">
          <div className="about-head-left">
            <h2 className="h2">About Me</h2>
            <div className="about-ctas">
              <Link to="/about" className="pill ghost">Learn More</Link>
              <div className="about-cta-pair">
                <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer" className="pill filled">COME SAY HI :)</a>
                <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer" className="pill icon-only pill--white">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="about-grid">
          <div className="about-col about-col--border">
            <span className="col-label">01. BACKGROUND</span>
            <div className="col-img-wrap">
              <img src={backgroundImg} alt="" className="col-img" style={{ objectPosition: 'center 71%' }} />
            </div>
            <p className="col-body">I studied cognitive science at CMU, then got my master&apos;s from the UW iSchool. Along the way I&apos;ve worked across enterprise IT, fintech, e-commerce, and education technology.</p>
          </div>
          <div className="about-col about-col--border">
            <span className="col-label">02. DESIGN APPROACH</span>
            <div className="col-img-wrap">
              <img src={designImg} alt="" className="col-img" />
            </div>
            <p className="col-body">I started out as a researcher and got curious about why findings don&apos;t always change what gets built. That&apos;s what pulled me into design.</p>
          </div>
          <div className="about-col about-col--border">
            <span className="col-label">03. OUTSIDE OF WORK</span>
            <div className="col-img-wrap">
              <img src={outsideWorkImg} alt="" className="col-img" />
            </div>
            <p className="col-body">I&apos;ve been singing in choirs and a cappella groups since middle school. Outside of that I&apos;m usually baking, crocheting, or hunting for the best boba in town.</p>
          </div>
          <div className="about-col">
            <span className="col-label">04. PLAYGROUND</span>
            <div className="col-img-wrap">
              <div className="col-img col-img--cool"></div>
            </div>
            <p className="col-body">Stuff I make when there&apos;s no brief: visual experiments, small tools, and typographic detours. More to come.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-credit">Created by MENGHAN</span>
        <div className="nav-links">
          <a href="#projects">PROJECTS</a>
          <Link to="/about">ABOUT</Link>
          <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </footer>
    </>
  )
}

function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about"               element={<AboutPage />} />
      <Route path="/research/amazon"      element={<ResearchPage slug="amazon" />} />
      <Route path="/research/expertvoice" element={<ResearchPage slug="expertvoice" />} />
      <Route path="/research/moomoo"      element={<ResearchPage slug="moomoo" />} />
      <Route path="/research/negotium"    element={<ResearchPage slug="negotium" />} />
      <Route path="/design/pin-mi"        element={<DesignPage slug="pin-mi" />} />
      <Route path="/design/dubjam"        element={<DesignPage slug="dubjam" />} />
      <Route path="/design/dory-vr"       element={<DesignPage slug="dory-vr" />} />
    </Routes>
    </>
  )
}

export default App
