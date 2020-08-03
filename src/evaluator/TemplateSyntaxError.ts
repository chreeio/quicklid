/**
 * Possible types of template syntax violations.
 */
export enum TemplateSyntaxErrorType {
  /**
   * A template beginning {{ token has no closing pair.
   */
  UNCLOSED_TEMPLATE_EXPRESSION,

  /**
   * The filter chain following the property pointer is invalid.
   */
  INVALID_FILTER_CHAIN,

  /**
   * The argument list of a filter is invalid.
   */
  INVALID_FILTER_ARGUMENTS,

  /**
   * The syntax of a string argument in the argument list is invalid.
   */
  INVALID_STRING_ARGUMENT,

  /**
   * The property contains invalid characters or is not of appropriate format.
   */
  INVALID_POINTER,
}

/**
 * Error thrown when a text template contains a syntax error.
 */
export class TemplateSyntaxError extends Error {
  /**
   * The exact type of the syntax violation.
   */
  readonly type: TemplateSyntaxErrorType

  /**
   * The zero indexed character position at which the error occurred.
   */
  readonly position: number

  constructor(type: TemplateSyntaxErrorType, position: number) {
    super(`Template syntax error of type ${type} at position ${position}`)

    this.type = type
    this.position = position
  }
}
