import { DefaultTemplateEvaluator } from './DefaultTemplateEvaluator'
import { defaultEvaluationOptions, TemplateEvaluator } from './TemplateEvaluator'

/**
 * Creates a new `TemplateEvaluator` instance.
 *
 * @returns A new `TemplateEvaluator` instance.
 */
function createInstance(): TemplateEvaluator {
  return new DefaultTemplateEvaluator()
}

export { createInstance, defaultEvaluationOptions, TemplateEvaluator }

export * from './CompiledTemplate'
export * from './EvaluationOptions'
export * from './FilterFunction'
export * from './TemplateSyntaxError'
export * from './UnknownFilterError'
export * from './UnknownPropertyError'
