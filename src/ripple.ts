const RIPPLE_SELECTOR = 'button, a, [role="button"], [data-ripple="true"]'

declare global {
  interface Window {
    __uiRippleInitialized?: boolean
  }
}

function isElementDisabled(element: HTMLElement): boolean {
  if (element.getAttribute('aria-disabled') === 'true') {
    return true
  }

  if (element instanceof HTMLButtonElement) {
    return element.disabled
  }

  return false
}

function isRippleDisabled(element: HTMLElement): boolean {
  return element.getAttribute('data-ripple') === 'false'
}

export function setupRippleEffects() {
  if (typeof window === 'undefined' || window.__uiRippleInitialized) {
    return
  }

  const createRipple = (event: PointerEvent) => {
    const target = event.target as HTMLElement | null
    if (!target) {
      return
    }

    const interactiveElement = target.closest<HTMLElement>(RIPPLE_SELECTOR)
    if (!interactiveElement || isElementDisabled(interactiveElement) || isRippleDisabled(interactiveElement)) {
      return
    }

    const rect = interactiveElement.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    const ripple = document.createElement('span')

    ripple.className = 'button-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`

    if (getComputedStyle(interactiveElement).position === 'static') {
      interactiveElement.dataset.ripplePositioned = 'true'
      interactiveElement.style.position = 'relative'
    }

    if (getComputedStyle(interactiveElement).overflow === 'visible') {
      interactiveElement.dataset.rippleOverflow = 'true'
      interactiveElement.style.overflow = 'hidden'
    }

    interactiveElement.appendChild(ripple)

    ripple.addEventListener('animationend', () => {
      ripple.remove()

      if (interactiveElement.dataset.ripplePositioned === 'true' && !interactiveElement.querySelector('.button-ripple')) {
        interactiveElement.style.position = ''
        delete interactiveElement.dataset.ripplePositioned
      }

      if (interactiveElement.dataset.rippleOverflow === 'true' && !interactiveElement.querySelector('.button-ripple')) {
        interactiveElement.style.overflow = ''
        delete interactiveElement.dataset.rippleOverflow
      }
    })
  }

  document.addEventListener('pointerdown', createRipple)
  window.__uiRippleInitialized = true
}
