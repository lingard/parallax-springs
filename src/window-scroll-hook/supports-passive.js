// @flow

let supports = false

try {
  // $FlowFixMe
  const opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      supports = true
    }
  })

  window.addEventListener('testPassive', null, opts)
  window.removeEventListener('testPassive', null, opts)
// eslint-disable-next-line no-empty
} catch (e) {}

const supportsPassive = () => supports

export default supportsPassive
