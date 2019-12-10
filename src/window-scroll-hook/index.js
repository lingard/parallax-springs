// @flow

import { useContext } from 'react'
import { AnimatedScrollPositionContext } from './context'

export { AnimatedScrollPositionProvider } from './context'

export const useAnimatedWindowScrollPosition = () => useContext(AnimatedScrollPositionContext)
