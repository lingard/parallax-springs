// @flow

import React, { createContext } from 'react'
import useAnimatedWindowScrollPosition from './animated-hook'

export const AnimatedScrollPositionContext = createContext<any>({})

type ProviderProps = {
  children: React$Node
}

export const AnimatedScrollPositionProvider = ({ children }: ProviderProps) => {
  const animatedScrollY = useAnimatedWindowScrollPosition()
  
  return (
    <AnimatedScrollPositionContext.Provider value={animatedScrollY}>
      {children}
    </AnimatedScrollPositionContext.Provider>
  )
}

