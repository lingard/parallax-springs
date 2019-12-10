// @flow

import React, { useContext } from 'react'
import { ParallaxParentContext } from './parallax-parent'
import Parallax from './parallax'

const useParallaxParent = () => {
  const node = useContext(ParallaxParentContext)

  return node
}

const ParallaxItem = (props: *) => {
  const node = useParallaxParent()

  return (
    <Parallax
      element={node}
      {...props}
    />
  )
}

export default ParallaxItem
