/**
 * Error thrown when an unknown property is found during template evaluation.
 */
export class UnknownPropertyError extends Error {
  /**
   * The name of the unknown property.
   */
  readonly propertyName: string

  constructor(propertyName: string) {
    super(`Unknown property: ${propertyName}`)

    this.propertyName = propertyName
  }
}
