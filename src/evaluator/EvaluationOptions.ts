import { FilterFunction } from './FilterFunction'

/**
 * Miscellaneous settings controlling how template evaluation is performed.
 */
export interface EvaluationOptions {
  /**
   * Whether to allow unknown properties. If set to `false`, then an
   * `UnknownPropertyError` will be thrown if an unknown property is found.
   * Unknown means, that a pointed property is not present on the substitution object.
   */
  allowUnknownProperties: boolean

  /**
   * If the `allowUnknownProperties` is set to `true`, then this
   * string is going to be substituted in place of unknown properties.
   */
  unknownPropertyPlaceholder: string

  /**
   * Whether to allow unknown filters. If set to `false`, then an
   * `UnknownFilterError` will be thrown if an unknown filter is found.
   * Unknown means, that there is no function in the `filters` object for
   * the specified name.
   */
  allowUnknownFilters: boolean

  /**
   * If the `allowUnknownFilters` is set to `true`, then this
   * function is going to be used in place of any unknown filter.
   */
  unknownFilterPlaceholder: FilterFunction

  /**
   * A mapping of filter functions to filter names.
   */
  filters: {
    [filterName: string]: FilterFunction
  }
}
