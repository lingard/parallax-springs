// @flow

import { getWindow, getBody, getDocumentElement } from 'maybe-window'

const getMaxScroll = () => {
  const window = getWindow()
  const body = getBody()
  const documentElement = getDocumentElement()
  const bodyHeights = body.map(body => ([
    body.scrollHeight,
    body.offsetHeight
  ]))
  const documentElementHeights = documentElement.map(element => ([
    element.clientHeight,
    element.scrollHeight,
    element.offsetHeight
  ]))
  const innerHeight = window.map(window => window.innerHeight).getOrElse(0)
  const maxHeight = Math.max(
    ...[
      ...bodyHeights.getOrElse([]),
      ...documentElementHeights.getOrElse([])
    ]
  )

  return Math.max(0, maxHeight - innerHeight)

  // (
  // Math.max(
  //   document.body.scrollHeight,
  //   document.body.offsetHeight,
  //   document.documentElement.clientHeight,
  //   document.documentElement.scrollHeight,
  //   document.documentElement.offsetHeight
  // ) - window.innerHeight
}

export default getMaxScroll
