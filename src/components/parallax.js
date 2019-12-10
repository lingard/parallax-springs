// @flow

import { map, curry, omit } from 'ramda'
import React, { useMemo } from 'react'
import { animated } from 'react-spring'
import { useAnimatedScrollRange } from '../scroll-range'
import useElementRef from '../use-element-ref'
import applyEasing from '../easing'
import createStyleInterpolations from '../create-style-interpolations'

import type { Segment, ElementSegment, ShorthandConfig } from '../scroll-range'
import type { InterpolateStyleProperties, Extrapolation } from '../create-style-interpolations'
import type { Easing } from '../easing'

type Self = 'self'

type SelfElementSegment = {
  ...ElementSegment,
  element: Self
}

type ConfigSegment = Segment | SelfElementSegment

type RangeProps = {|
  range: Array<Segment>
|}

type ShorthandProps = {|
  ...$Shape<ShorthandConfig>,
  element?: Self | HTMLElement
|}

type SharedProps = {|
  extrapolate?: Extrapolation,
  extrapolateLeft?: Extrapolation,
  extrapolateRight?: Extrapolation,
  easing?: Easing,
  properties: InterpolateStyleProperties,
  children?: React$Node
|}

type Props = {
  ...SharedProps,
  ...ShorthandProps,
  ...RangeProps
}

const applySelf = curry<?HTMLElement, ConfigSegment, Segment>(
  (element: ?HTMLElement, segment: ConfigSegment): Segment => {
    if (segment.element === 'self') {
      return {
        ...omit(['element'], segment),
        element
      }
    }

    return segment
  }
)

const useCreateScrollRangeConfig = ({ node, range, element, offset, duration }) => {
  const config = useMemo((): ShorthandConfig => {
    const applySelfNode = applySelf(node)

    if (range) {
      return map(applySelfNode, range)
    }

    return applySelfNode({
      element,
      offset,
      duration
    })
  }, [range, element, offset, duration, node])

  return config
}

const Parallax = ({
  range,
  element = 'self',
  offset,
  duration,

  easing,
  properties,
  extrapolate = 'clamp',
  extrapolateLeft,
  extrapolateRight,
  ...other
}: Props) => {
  const [ref, node] = useElementRef()
  const scrollRangeConfig = useCreateScrollRangeConfig({
    node,
    element,
    offset,
    duration,
    range
  })
  const animatedScrollRange = useAnimatedScrollRange(scrollRangeConfig)
  
  const style = createStyleInterpolations(animatedScrollRange, properties, {
    extrapolate,
    extrapolateLeft,
    extrapolateRight,
    easing: v => applyEasing(easing, v)
  })

  return (
    <animated.div
      ref={ref}
      style={style}
      {...other}
    />
  )
}

export default Parallax
