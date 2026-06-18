import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import CircularGallery from '../components/CircularGallery'
import twiceImg from '../img/twice.jpeg'
import riizeImg from '../img/riize.avif'
import superImg from '../img/super.jpg'
import comboImg from '../img/combo.png'
import love119Img from '../img/love119.jpg'
import newjeansImg from '../img/newjeans.jpeg'
import plasticLoveImg from '../img/plastic-love.webp'
import choirImg from '../img/homepage/choir.avif'
import bobaImg from '../img/homepage/boba.avif'
import aboutmeImg from '../img/homepage/aboutme.avif'
import './AboutPage.css'

const MUSIC_ITEMS = [
  { image: twiceImg,       text: 'TWICE',        link: 'https://open.spotify.com/search/Up%20No%20More%20TWICE' },
  { image: riizeImg,       text: 'RIIZE',        link: 'https://open.spotify.com/album/4YqJnxf3dYKhosGRrfoQQo' },
  { image: superImg,       text: 'NEW JEANS',    link: 'https://open.spotify.com/track/5ocSQW5sIUIOFojwXEz9Ki' },
  { image: comboImg,       text: 'RIIZING',      link: 'https://open.spotify.com/search/RIIZE%20Combo' },
  { image: love119Img,     text: 'LOVE 119',     link: 'https://open.spotify.com/track/0lUtQTBt2ydznYzuAeYFrZ' },
  { image: newjeansImg,    text: 'NEW JEANS',    link: 'https://open.spotify.com/album/1HMLpmZAnNyl9pxvOnTovV' },
  { image: plasticLoveImg, text: 'PLASTIC LOVE', link: 'https://open.spotify.com/track/7rU6Iebxzlvqy5t857bKFq' },
]

const INDUSTRY_ROWS = [
  { role: 'Graduate Market Research Intern', company: 'Meyocks',              date: 'Spring 2026' },
  { role: 'UX Research Intern',             company: 'Amazon (IT UX)',         date: 'Summer 2025' },
  { role: 'Product Design Intern',          company: 'Fundhomes',              date: 'Fall 2025'   },
  { role: 'Product Research Intern',        company: 'ExpertVoice',            date: 'Summer 2024' },
  { role: 'UX Research Intern',             company: 'FUTU Holdings (Moomoo)', date: 'Summer 2023' },
]

function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Menghan">
      <g transform="translate(4.36, 2.18)">
        <path d="M11.648 14.8189C11.4386 14.8189 11.2582 14.7258 11.1069 14.5396C10.9673 14.3535 10.8975 14.0276 10.8975 13.5622C10.8975 13.2945 10.9499 12.9804 11.0546 12.6196C11.2873 11.8865 11.5259 11.1011 11.7702 10.2633C12.0262 9.42546 12.2648 8.57018 12.4859 7.69746C12.7186 6.82473 12.9048 5.98109 13.0444 5.16655C13.184 4.34036 13.2539 3.584 13.2539 2.89745C13.2539 2.66473 13.2422 2.43782 13.2189 2.21673C13.2073 1.99564 13.1782 1.78618 13.1317 1.58836C11.9564 2.70545 10.8684 4.224 9.86767 6.144C8.87858 8.05236 7.97676 10.2749 7.16222 12.8116C7.02258 13.1956 6.84804 13.4633 6.63858 13.6145C6.42913 13.7658 6.23131 13.8415 6.04513 13.8415C5.88222 13.8415 5.72513 13.7775 5.57386 13.6495C5.42258 13.5098 5.34695 13.3004 5.34695 13.0211C5.34695 12.8349 5.39349 12.5731 5.48658 12.2356C5.57967 11.8865 5.74258 11.5665 5.97531 11.2756C6.10331 10.5076 6.20804 9.69309 6.28949 8.832C6.38258 7.97091 6.42913 7.17382 6.42913 6.44073C6.42913 6.10327 6.41167 5.78909 6.37676 5.49818C6.35349 5.19564 6.31276 4.93382 6.25458 4.71273C5.64949 5.35273 5.08513 6.15564 4.56149 7.12146C4.04949 8.07564 3.59567 9.10546 3.20004 10.2109C2.8044 11.3047 2.47276 12.3753 2.20513 13.4225C1.99567 14.1789 1.65822 14.5571 1.19276 14.5571C1.00658 14.5571 0.849491 14.4582 0.721491 14.2604C0.605127 14.0625 0.546945 13.7658 0.546945 13.3702C0.546945 12.9862 0.640036 12.4684 0.826218 11.8167C1.0124 11.1651 1.26258 10.4495 1.57676 9.66982C1.90258 8.89018 2.26331 8.11636 2.65895 7.34836C3.06622 6.56873 3.48513 5.85891 3.91567 5.21891C4.35785 4.56727 4.7884 4.04364 5.20731 3.648C5.62622 3.25236 6.0044 3.05455 6.34186 3.05455C6.56295 3.05455 6.76076 3.09527 6.93531 3.17673C7.10986 3.25818 7.26113 3.42691 7.38913 3.68291C7.51713 3.92727 7.61022 4.30546 7.6684 4.81745C7.73822 5.31782 7.77313 5.98691 7.77313 6.82473C7.77313 6.976 7.77313 7.15055 7.77313 7.34836C8.11058 6.41745 8.5004 5.51564 8.94258 4.64291C9.3964 3.75855 9.87349 2.96727 10.3739 2.26909C10.8742 1.57091 11.3746 1.01818 11.8749 0.61091C12.3753 0.203637 12.8466 0 13.2888 0C13.7891 0 14.1964 0.273455 14.5106 0.820364C14.8248 1.35564 14.9819 2.19927 14.9819 3.35127C14.9819 4.44509 14.8946 5.50982 14.72 6.54546C14.5455 7.58109 14.3244 8.55855 14.0568 9.47782C13.8008 10.3971 13.5331 11.2349 13.2539 11.9913C12.9862 12.736 12.7535 13.376 12.5557 13.9113C12.4277 14.2371 12.2939 14.4698 12.1542 14.6095C12.0146 14.7491 11.8459 14.8189 11.648 14.8189Z" fill="url(#ap-logo-m)"/>
        <circle cx="1.81819" cy="17.9695" r="1.81818" fill="url(#ap-logo-d1)"/>
        <circle cx="10.5455" cy="17.9695" r="1.81818" fill="url(#ap-logo-d2)"/>
      </g>
      <defs>
        <linearGradient id="ap-logo-m" x1="6.247" y1="3.543" x2="19.703" y2="17.389" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
        <linearGradient id="ap-logo-d1" x1="4.698" y1="18.666" x2="7.996" y2="22.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
        <linearGradient id="ap-logo-d2" x1="13.425" y1="18.666" x2="16.723" y2="22.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#487089"/><stop offset="1" stopColor="#88D8C0"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const page = document.querySelector('.ap-page')
    if (page) page.classList.add('js-anim')

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="ap-page">

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          <span>Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · </span>
          <span aria-hidden="true">Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · UX Researcher · Product Designer · Based in Seattle · Building thoughtful digital experiences · Open to opportunities · </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="nav-links">
          <Link to="/">PROJECTS</Link>
          <NavLink to="/about">ABOUT</NavLink>
          <a href="https://www.linkedin.com/in/menghl/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </nav>

      <main className="ap-main">
        <div className="ap-col">

          {/* Opening */}
          <header className="ap-opening">
            <h1 className="ap-title">About Me</h1>
            <p className="ap-subtitle">I study how people think, then design for what they actually need.</p>
            <img
              src={aboutmeImg}
              alt="Menghan"
              className="ap-portrait"
              data-reveal="fade"
              style={{ '--d': 400 }}
            />
          </header>

          {/* Background */}
          <section className="ap-section" data-reveal="section">
            <span className="ap-label">BACKGROUND</span>
            <p className="ap-body" data-reveal="fade">
              Hi, I&apos;m Menghan, a UX researcher and product designer based in Seattle. I recently
              graduated from the UW Information School with a master&apos;s degree, and I previously
              graduated from Carnegie Mellon, where I first started thinking about how people make
              sense of the things around them.
            </p>
          </section>

          {/* Industry */}
          <section className="ap-section ap-section--plain" data-reveal="section">
            <span className="ap-label">INDUSTRY</span>
            <div className="ap-rows">
              {INDUSTRY_ROWS.map((row, i) => (
                <div className="ap-row" key={i} style={{ '--i': i }} data-reveal="row">
                  <div className="ap-row-main">
                    <span className="ap-row-role">{row.role}</span>
                    <span className="ap-row-date">{row.date}</span>
                  </div>
                  <span className="ap-row-company">{row.company}</span>
                </div>
              ))}
            </div>
            <p className="ap-body" data-reveal="fade">
              I&apos;ve worked across enterprise IT, FinTech, e-commerce, real estate, and market
              research, delivering business-driven insights related to design and strategy. My training
              in cognitive science and data science gave me a foundation in psychological
              experimentation and statistical analysis. That means I&apos;m equally comfortable running
              a diary study or designing a survey at scale. What drives the choice is always the
              question, not the method.
            </p>
          </section>

          {/* Academic Research */}
          <section className="ap-section ap-section--plain" data-reveal="section">
            <span className="ap-label">ACADEMIC RESEARCH</span>
            <p className="ap-body" data-reveal="fade">
              Beyond industry, I&apos;ve spent five years conducting academic research across UW Pulse
              Lab, CMU Learn Lab, and CMU CoEx Lab, spanning education technology, socially-conscious
              AI, and science communications with papers published at venues like CSCW along the way.
            </p>
          </section>

          {/* Design Approach */}
          <section className="ap-section" data-reveal="section">
            <span className="ap-label">DESIGN APPROACH</span>
            <p className="ap-body" data-reveal="fade" style={{ '--d': 0 }}>
              My background grounded me in both analytical and humanistic approaches. I started out as
              a researcher, but my curiosity about how research influences design naturally pulled me
              into doing design too.
            </p>
            <p className="ap-body" data-reveal="fade" style={{ '--d': 80 }}>
              I believe good design starts with understanding people, asking sharp questions, and
              blending data with empathy. It&apos;s a conversation that thrives on listening, iteration,
              and collaboration. That also means thinking carefully about ways of interaction.
            </p>
            <p className="ap-body" data-reveal="fade" style={{ '--d': 160 }}>
              <strong className="ap-strong">Curiosity</strong> drives everything I do. I love exploring
              how people think and behave, and I&apos;m just as energized by learning new tools and
              skills. That mindset keeps me grounded, adaptable, and trusted by teammates.
            </p>

            <blockquote className="ap-pullquote">
              <span className="ap-quote-mark" data-reveal="scale">&#x201C;</span>
              <p className="ap-quote-text" data-reveal="fade" style={{ '--d': 180 }}>
                Good design should move at the speed people actually need to think, decide, and trust.
              </p>
            </blockquote>
          </section>

          {/* Outside Work */}
          <section className="ap-section" data-reveal="section">
            <span className="ap-label">OUTSIDE WORK</span>
            <p className="ap-body" data-reveal="fade">
              You&apos;ll often find me baking, crocheting, looking for boba tea shops, or singing.
              I&apos;ve been in choirs and a cappella groups since middle school, and music remains one
              of my favorite creative outlets.
            </p>
            <div className="ap-img-grid" data-reveal="fade" style={{ '--d': 120 }}>
              <img src={choirImg} alt="Choir" className="ap-img-ph" />
              <img src={bobaImg} alt="Boba" className="ap-img-ph" />
            </div>
          </section>

          {/* Currently on Repeat */}
          <section className="ap-section ap-section--music" data-reveal="section">
            <span className="ap-label">CURRENTLY ON REPEAT</span>
            <div className="ap-gallery-wrap">
              <CircularGallery
                items={MUSIC_ITEMS}
                bend={0}
                textColor="#3a3a3a"
                borderRadius={0.02}
                borderColor="#E0DDDA"
                font="400 15px 'Playfair Display'"
                fontUrl="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&display=swap"
                gap={1.0}
                showBorder={false}
                showLabels={false}
                scrollSpeed={2}
                scrollEase={0.03}
              />
            </div>
          </section>

          {/* CTA */}
          <div className="ap-cta" data-reveal="cta">
            <p className="ap-cta-text">Always open to new opportunities and interesting conversations</p>
            <div className="ap-cta-pills">
              <Link to="/" className="pill ghost">BACK TO PROJECTS</Link>
              <a
                href="https://www.linkedin.com/in/menghl/"
                target="_blank"
                rel="noopener noreferrer"
                className="pill ghost"
              >LINKEDIN</a>
            </div>
          </div>

        </div>
      </main>

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
