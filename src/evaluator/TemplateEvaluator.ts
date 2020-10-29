import { EvaluationOptions } from './EvaluationOptions'

import { CompiledTemplate } from '../compiler/CompiledTemplate'

/**
 * Compiler and evaluator of Quicklid templates.
 */
export interface TemplateEvaluator {
  /**
   * Takes a template string and compiles it into an easy-to-evaluate format. This speeds up
   * multiple evaluations of the same template string.
   *
   * The compiled representation is independent from filter implementations. It's just
   * a structured representation of the template string.
   * @param template The template string to compile.
   * @returns A compiled template.
   */
  compileTemplate(template: string): CompiledTemplate

  /**
   * Evaluates the specified template against the passed subsitution data. The filter functions
   * and the exact behavior of the evaluation can be set through the `options` parameter.
   * throws UnknownFilterError, throws UnknownPropertyError
   * @param compiledTemplate The compiled template to substitute into.
   * @param substitutionData An object containing the data that should be used when resolving property pointers.
   * @param options Additional options for the evaluation. For example, the filter functions.
   */
  evaluateCompiledTemplate(
    compiledTemplate: CompiledTemplate,
    substitutionData: Record<string, unknown>,
    options?: Partial<EvaluationOptions>
  ): string
}

/**
 * Default options for template evaluation. If some property of the `EvaluationOptions` is not set,
 * then the appropriate default value on this object is going to be used.
 */
export const defaultEvaluationOptions: Readonly<EvaluationOptions> = {
  allowUnknownProperties: true,

  unknownPropertyPlaceholder: 'undefined',

  allowUnknownFilters: true,

  unknownFilterPlaceholder(input: string): string {
    return input
  },

  filters: {},
}
