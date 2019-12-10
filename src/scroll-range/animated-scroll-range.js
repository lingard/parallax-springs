// @flow

import { useMemo } from 'react'
import { interpolate } from 'react-spring'
import { useAnimatedWindowScrollPosition } from '../window-scroll-hook'
import useShorthandScrollOffsetRange from './shorthand-scroll-range'

import type { Config } from './shorthand-scroll-range'

const TEMP_RANGE = [0, 3000]

const useAnimatedScrollOffsetRange = (config: Config) => {
  const inputRange = useShorthandScrollOffsetRange(config)
  const scrollPosition = useAnimatedWindowScrollPosition()
  const value = useMemo(() => (
    interpolate(scrollPosition, inputRange|| TEMP_RANGE, [0, 1])
  ), [scrollPosition, inputRange])

  return value
}

export default useAnimatedScrollOffsetRange
