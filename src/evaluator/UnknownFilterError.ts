/**
 * Error thrown when an unknown filter is found during template evaluation.
 */
export class UnknownFilterError extends Error {
  /**
   * The name of the unknown filter.
   */
  readonly filterName: string

  constructor(filterName: string) {
    super(`Unknown filter: ${filterName}`)

    this.filterName = filterName
  }
}
