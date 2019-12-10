// @flow

import { transpose } from 'ramda'
import React from 'react'
import Parallax from './parallax'

type ParallaxOffsetProps = {
  offsetX?: Array<number | string>,
  offsetY?: Array<number | string>,
  children?: React$Node
}

const ParallaxOffset = ({
  offsetX = [0, 0],
  offsetY = [0, 0],
  ...other
}: ParallaxOffsetProps) => (
  <Parallax
    properties={{
      transform: [
        {
          translate: transpose([offsetX, offsetY])
        }
      ]
    }}
    {...other}
  />
)

export default ParallaxOffset
