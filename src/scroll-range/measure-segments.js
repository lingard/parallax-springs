// @flow

import { useState, useEffect } from 'react'
import { compose, pluck, filter, has } from 'ramda'
import useMeasureElements from '../use-measure-elements'

import type { Range, MeasuredRange, Segment, ElementSegment } from './segment'

const getElementsFromSegments = compose<Array<Segment>, Array<ElementSegment>, Array<HTMLElement>>(
  // $FlowFixMe
  pluck('element'),
  filter(has('element'))
)

const useMeasureElementSegments = (segments: Range): ?MeasuredRange => {
  const elements = getElementsFromSegments(segments)
  const measures = useMeasureElements(elements)
  const [state, setState] = useState<?MeasuredRange>(null)

  useEffect(() => {
    const newState = segments.map((segment) => {
      if (!segment.element) {
        return segment
      }

      const measure = measures.find((measure => 
        measure.target === segment.element
      ))

      if (!measure) {
        return segment
      }

      return {
        ...segment,
        measure
      }
    })

    setState(newState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measures])

  return state
}

export default useMeasureElementSegments
