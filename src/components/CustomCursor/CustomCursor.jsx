import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef    = useRef(null)
  const targetRef = useRef(null)

  useEffect(() => {
    const dot    = dotRef.current
    const target = targetRef.current

    let mouseX = 0, mouseY = 0
    let started = false

    const show = () => {
      dot.style.opacity    = '1'
      target.style.opacity = '1'
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      dot.style.left    = mouseX + 'px'
      dot.style.top     = mouseY + 'px'
      target.style.left = mouseX + 'px'
      target.style.top  = mouseY + 'px'

      if (!started) {
        started = true
        show()
      }
    }

    const onDocLeave = () => {
      dot.style.opacity    = '0'
      target.style.opacity = '0'
    }

    const onDocEnter = () => {
      if (started) show()
    }

    const SELECTOR = 'a, button, input, .pill, [role="button"]'

    const onMouseOver = (e) => {
      if (e.target.closest(SELECTOR)) {
        target.classList.add('is-hovering')
      }
    }

    const onMouseOut = (e) => {
      if (e.target.closest(SELECTOR)) {
        target.classList.remove('is-hovering')
      }
    }


    window.addEventListener('mousemove',       onMouseMove)
    document.addEventListener('mouseleave',    onDocLeave)
    document.addEventListener('mouseenter',    onDocEnter)
    document.addEventListener('mouseover',     onMouseOver)
    document.addEventListener('mouseout',      onMouseOut)

    return () => {
      window.removeEventListener('mousemove',      onMouseMove)
      document.removeEventListener('mouseleave',   onDocLeave)
      document.removeEventListener('mouseenter',   onDocEnter)
      document.removeEventListener('mouseover',    onMouseOver)
      document.removeEventListener('mouseout',     onMouseOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={targetRef} className="cursor-target">
        <span className="ct-tl" />
        <span className="ct-tr" />
        <span className="ct-bl" />
        <span className="ct-br" />
      </div>
    </>
  )
}
