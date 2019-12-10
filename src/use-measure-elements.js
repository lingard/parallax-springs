// @flow

import { equals, length, filter, identity } from 'ramda'
import { useState, useLayoutEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

function getElementOffset(element: HTMLElement) {
  let top = 0
  let currentElement = element

  do {
    // $FlowFixMe
    top += currentElement.offsetTop || 0
    // $FlowFixMe
    currentElement = currentElement.offsetParent
  } while (currentElement)

  return {
    top,
    left: 0
  }
}

const allDefined = (arr) =>
  equals(
    length(arr),
    // $FlowFixMe
    length(filter(identity, arr))
  )

export type MeasuredElement = {
  target: HTMLElement,
  rect: ClientRect,
  offset: {
    top: number,
    left: number
  }
}

const measureElement = (element: HTMLElement) => ({
  target: element,
  measured: true,
  rect: element.getBoundingClientRect(),
  offset: getElementOffset(element)
})

const useMeasureElements = (elements: Array<?HTMLElement>): ?Array<MeasuredElement> => {
  const [measures, setMeasures] = useState<?Array<MeasuredElement>>(null)
  const allElementsDefined = allDefined(elements)

  useLayoutEffect(() => {
    if (!allElementsDefined) {
      return
    }

    // $FlowFixMe
    const measureElements = () => setMeasures(elements.map(measureElement))

    measureElements()

    const resizeObserver = new ResizeObserver(measureElements)
      // (entries: Array<ResizeObserverEntry>) => {
      //   setRects(entries.map(measureResizeObserverEntry))
      // }
    // )
    // $FlowFixMe
    resizeObserver.observe(...[document.documentElement, ...elements])
    window.addEventListener('resize', measureElements, false)

    return () => {
      // $FlowFixMe
      resizeObserver.unobserve(...[document.documentElement, ...elements])
      window.removeEventListener('resize', measureElements, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allElementsDefined])

  return measures
}

export default useMeasureElements
