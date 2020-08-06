import {
  CompiledTemplate,
  CompiledTemplateFragment,
  TextFragment,
  ExpressionFragment,
  CompiledFilter,
} from './CompiledTemplate'
import { EvaluationOptions } from './EvaluationOptions'
import { UnknownFilterError } from './UnknownFilterError'
import { UnknownPropertyError } from './UnknownPropertyError'

interface ResolutionResult {
  value?: unknown
  present: boolean
}

type SubstitutionObject = Record<string, unknown>

/**
 * Class responsible for substituting data into compiled templates (which is called
 * the evaluation of the template).
 */
export class CompiledTemplateEvaluator {
  /**
   * Evaluates the specified template against the passed subsitution data. The filter functions
   * and the exact behavior of the evaluation can be set through the `options` parameter.
   * @param compiledTemplate The compiled template to substitute into.
   * @param substitutionData An object containing the data that should be used when resolving property pointers.
   * @param options Additional options for the evaluation. For example, the filter functions.
   */
  evaluateCompiledTemplate(
    compiledTemplate: CompiledTemplate,
    substitutionData: Record<string, unknown>,
    options: EvaluationOptions
  ): string {
    const result = compiledTemplate.fragments
      .map((fragment) => this.evaluateFragment(fragment, substitutionData, options))
      .join('')

    return result
  }

  private evaluateFragment(
    fragment: CompiledTemplateFragment,
    substitutionData: Record<string, unknown>,
    options: EvaluationOptions
  ): string {
    return this.isTextFragment(fragment)
      ? fragment.text
      : this.evaluateExpressionFragment(fragment, substitutionData, options)
  }

  private evaluateExpressionFragment(
    fragment: ExpressionFragment,
    substitutionData: Record<string, unknown>,
    options: EvaluationOptions
  ): string {
    const pointerValue = this.evaluatePointerValue(fragment.pointerSegments, substitutionData, options)

    return fragment.filters.reduce((input, filter) => this.evaluateFilter(input, filter, options), pointerValue)
  }

  private evaluatePointerValue(
    pointerSegments: string[],
    substitutionData: Record<string, unknown>,
    options: EvaluationOptions
  ): string {
    const resolutionResult = this.resolvePointer(pointerSegments, substitutionData)

    if (!resolutionResult.present && !options.allowUnknownProperties) {
      throw new UnknownPropertyError(pointerSegments.join('.'))
    }

    const property = resolutionResult.present ? resolutionResult.value : options.unknownPropertyPlaceholder

    return `${property}`
  }

  private evaluateFilter(input: string, filter: CompiledFilter, options: EvaluationOptions): string {
    const resolutionResult = this.resolveFilter(input, filter, options)

    if (!resolutionResult.present && !options.allowUnknownFilters) {
      throw new UnknownFilterError(filter.name)
    }

    const value = resolutionResult.present
      ? resolutionResult.value
      : options.unknownFilterPlaceholder(input, filter.args)

    return value as string
  }

  private resolvePointer(pointerSegments: string[], substitutionData: Record<string, unknown>): ResolutionResult {
    let result = substitutionData

    for (const segment of pointerSegments) {
      if (this.isSubstitutionObjectWithProperty(result, segment)) {
        result = result[segment] as Record<string, unknown>
      } else {
        return { present: false }
      }
    }

    return { value: result, present: true }
  }

  private isSubstitutionObjectWithProperty(obj: Record<string, unknown>, property: string): obj is SubstitutionObject {
    return typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, property)
  }

  private resolveFilter(input: string, filter: CompiledFilter, options: EvaluationOptions): ResolutionResult {
    const filterFunction = options.filters[filter.name]

    if (!filterFunction) {
      return { present: false }
    }

    return { value: filterFunction(input, filter.args), present: true }
  }

  private isTextFragment(fragment: CompiledTemplateFragment): fragment is TextFragment {
    return (fragment as TextFragment).text !== undefined
  }
}
