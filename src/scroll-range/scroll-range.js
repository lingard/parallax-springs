// @flow

import { map, isNil, is, has } from 'ramda'
import { useState, useLayoutEffect } from 'react'
import getMaxScroll from './max-scroll'
import relativeToPx from './relative-to-px'
import useMeasureElementSegments from './measure-segments'

import type { Range, MeasuredSegment } from './segment'

const subtractWindowHeight = height => height - window.innerHeight

const useScrollOffsetRange = (configRange: Range) => {
  const measuredRange = useMeasureElementSegments(configRange)
  const [range, setRange] = useState(null)

  useLayoutEffect(() => {
    if (!measuredRange) {
      return
    }

    const maxScroll = getMaxScroll()

    const getOffset = ({ offset, measure, element }) => {
      if (isNil(offset)) {
        return 0
      }

      if (is(Function, offset)) {
        return offset(measure, element)
      }

      return relativeToPx(offset, maxScroll)
    }

    const segmentToOffset = (segment: MeasuredSegment): number => {
      if (has('element', segment)) {
        const { measure } = segment

        if (!measure) {
          return 0
        }

        const offset = getOffset(segment)

        return Math.max(0, subtractWindowHeight(measure.offset.top) + offset)
      }

      const { value } = segment
      const offset = getOffset(segment)

      return value + offset
    }

    setRange(map<MeasuredSegment, number>(segmentToOffset, measuredRange))
  }, [measuredRange])

  return range
}

export default useScrollOffsetRange
