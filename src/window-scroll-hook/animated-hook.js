// @flow

import { useLayoutEffect, useRef } from 'react'
import { useSpring } from 'react-spring'
import { getScrollY } from 'maybe-window'
import supportsPassive from './supports-passive'

const useWindowScrollPosition = () => {
  const [{ scrollY }, setScrollY] = useSpring(() => ({
    scrollY: getScrollY(),
    immediate: true
  }))
  const prevScrollY = useRef(getScrollY())
  const hasScheduledUpdate = useRef(false)

  useLayoutEffect(() => {
    const updateScroll = () => {
      if (hasScheduledUpdate.current) {
        return
      }

      const scrollY = getScrollY()

      if (scrollY !== prevScrollY.current) {
        hasScheduledUpdate.current = true

        window.requestAnimationFrame(() => {
          setScrollY({
            scrollY
          })
          hasScheduledUpdate.current = false
          prevScrollY.current = scrollY
        })
      }
    }

    window.addEventListener(
      'scroll',
      updateScroll,
      supportsPassive() ? { passive: true } : false
    )

    window.requestAnimationFrame(updateScroll)

    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [setScrollY])

  return scrollY
}

export default useWindowScrollPosition
