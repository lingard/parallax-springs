// @flow

const UNIT_REGEX = /^-?\d+(\.\d+)?(px|vh|%)?$/

const relativeToPx = (value: string | number, contextHeight: number): number => {
  const floatValue = parseFloat(value)
  const unit = String(value).match(UNIT_REGEX)[2] || null
  const vh = window.innerHeight / 100

  let valueInPx = value

  switch (unit) {
    case 'vh':
      valueInPx = vh * floatValue
      break
    case '%':
      valueInPx = contextHeight * floatValue / 100
      break

    default:
      valueInPx = floatValue
  }

  return valueInPx
}

export default relativeToPx