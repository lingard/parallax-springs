// @flow

import { useState, useCallback } from 'react'

type setNode = (node: ?mixed) => void

const useElementRef = (): [setNode, ?HTMLElement] => {
  const [node, setNode] = useState<?HTMLElement>(null)
  const setRef = useCallback((newNode: ?mixed) => {
    if (newNode && newNode !== node && newNode instanceof HTMLElement) {
      setNode(newNode)
    }
  }, [node])

  return [setRef, node]
}

export default useElementRef
