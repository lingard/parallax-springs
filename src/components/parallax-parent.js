// @flow

import React, { createContext } from 'react'
import useElementRef from '../use-element-ref'

export const ParallaxParentContext = createContext<?HTMLElement>(null)

type ProviderProps = {
  children: React$Element<*>
}

const ParallaxParent = ({ children }: ProviderProps) => {
  const [ref, element] = useElementRef()
  const child = React.cloneElement(children, {
    ref
  })

  return (
    <ParallaxParentContext.Provider value={element}>
      {child}
    </ParallaxParentContext.Provider>
  )
}

export default ParallaxParent
