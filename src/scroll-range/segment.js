// @flow

import type { MeasuredElement } from '../use-measure-elements'

export type TransformFn = (measure: MeasuredElement, element: HTMLElement) => number

export type ElementSegment = {|
  element: ?HTMLElement,
  offset?: number | TransformFn
|}

export type StaticSegment = {
  value: string | number
}

export type Segment =
  ElementSegment | StaticSegment

export type MeasuredSegment =
  ElementSegment | StaticSegment

export type Range = Array<Segment>
export type MeasuredRange = Array<MeasuredSegment>