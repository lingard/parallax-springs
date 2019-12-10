// @flow

import { compose, join, keys, reduce, toPairs, times, mapObjIndexed } from 'ramda'
import { interpolate } from 'react-spring'

// const TRANSFORM_KEY = 'transform'

const TRANSFORM_MAP = {
  rotate: (value) => `rotate(${value})`,
  rotateX: (value) => `rotateX(${value})`,
  rotateY: (value) => `rotateY(${value})`,
  rotateZ: (value) => `rotateZ(${value})`,
  scale: value => `scale(${value})`,
  scaleX: value => `scaleX(${value})`,
  scaleY: value => `scaleY(${value})`,
  scaleZ: value => `scaleZ(${value})`,
  skew: (value) => `skew(${value})`,
  skewX: (value) => `skewX(${value})`,
  skewY: (value) => `skewY(${value})`,
  skewZ: (value) => `skewZ(${value})`,
  translate: (value) => `translate3d(${value[0]}, ${value[1]}, 0)`,
  translateX: (value) => `translate3d(${value}, 0, 0)`,
  translateY: (value) => `translate3d(0, ${value}, 0)`,
  translateZ: (value) => `translate3d(0, 0, ${value})`
}

export type Extrapolation = 'clamp' | 'identity' | 'extend'

type InterpolationRange = Array<string> | Array<number>

type Interpolator = (outputRange: InterpolationRange, options: *) => *

type InterpolationOptions = {
  easing?: number => number,
  extrapolate?: Extrapolation,
  extrapolateLeft?: Extrapolation,
  extrapolateRight?: Extrapolation
}

type Range = InterpolationRange | (range: InterpolationRange) => InterpolationRange

type StyleConfig = {|
  ...$Exact<InterpolationOptions>,
  input?: Range,
  output: Range
|}

type TransformProp = $Keys<typeof TRANSFORM_MAP>

type TransformStyle = {
  [TransformProp]: InterpolationRange
}

type StyleProperty = InterpolationRange | StyleConfig | Array<TransformStyle>

export type InterpolateStyleProperties = {
  [string]: StyleProperty
}

const createTransformRange = (transforms: Array<TransformStyle>) =>
  reduce((range: Array<string>, style) => {
    const [[key, value]] = toPairs(style)
    const transformCreator = TRANSFORM_MAP[key]

    if (!transformCreator) {
      throw new Error(`${key} is not a valid transform property`)
    }

    return times((i) =>
      `${range[i] || ''} ${transformCreator(value[i])}`,
      value.length
    )
  }, [], transforms)

const isStyleConfig = (value: StyleProperty): boolean %checks => 
  typeof(value) === 'object' && !Array.isArray(value) && value.output !== null

const stylesToWillChange = compose(join(', '), keys)

const getRange = (value: Range, inputRange: InterpolationRange) => {
  if (typeof(value) === 'function') {
    const range = value(inputRange)

    return range
  }

  if (Array.isArray(value)) {
    return value
  }

  return inputRange
}

type AnimatedInterpolation = {
  range: Array<number> | InterpolationOptions | (...args: Array<*>) => *,
  output?: Array<(number | string)>,
  extrapolate: Extrapolation
}

type AnimatedValue = {
  interpolate: AnimatedInterpolation,
  getValue(): number | string,
  setValue(value: number | string, flush: boolean): void
}

const createStyleInterpolations = (
  animatedValue: AnimatedValue,
  properties: InterpolateStyleProperties,
  options: InterpolationOptions = {}
) => {
  const styles = mapObjIndexed<StyleProperty, Interpolator>((value: StyleProperty, property: string): Interpolator => {
    if (property === 'transform') {
      const outputRange = createTransformRange(value)

      return interpolate(animatedValue, {
        output: outputRange,
        ...options
      })
    }

    if (isStyleConfig(value)) {
      const { input, output, ...other } = value
      const inputRange = getRange(input, [0, 1])
      const outputRange = getRange(output, inputRange)

      if (inputRange.length !== outputRange.length) {
        throw new Error(`the lenght of inputRange & outputRange must be equal`)
      }

      return interpolate(
        animatedValue,
        {
          range: inputRange,
          output: outputRange,
          ...other,
          ...options
        }
      )
    }

    return interpolate(animatedValue, {
      output: value,
      ...options
    })
  }, properties)

  return {
    ...styles,
    willChange: stylesToWillChange(styles)
  }
}

export default createStyleInterpolations
