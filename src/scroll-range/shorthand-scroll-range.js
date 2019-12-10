// @flow

import { compose, not, is } from 'ramda'
import useScrollRange from './scroll-range'

import type { ElementSegment, Range, TransformFn } from './segment'

export type ShorthandConfig = {|
  ...$Shape<ElementSegment>,
  duration?: TransformFn
|}

export type Config = Range | ShorthandConfig

const isShorthandConfig = compose(not, is(Array))

const getRange = (config: Config): Range => {
  if (!isShorthandConfig(config)) {
    // $FlowFixMe
    return config
  }

  // Use the height of the element as the default duration if none is provided...
  const duration = config.duration || (({ rect }) =>
    rect.height + window.innerHeight
  )

  // $FlowFixMe
  return [config, {
    // $FlowFixMe
    element: config.element,
    // $FlowFixMe
    value: config.value || 0,
    offset: duration
  }]
}

const useSingleConfigScrollRange = (config: Config) => {
  const range = getRange(config)

  return useScrollRange(range)
}

export default useSingleConfigScrollRange