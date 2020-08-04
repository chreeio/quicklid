import { DefaultTemplateEvaluator } from './evaluator/DefaultTemplateEvaluator'
import { defaultEvaluationOptions, TemplateEvaluator } from './evaluator/TemplateEvaluator'

/**
 * Creates a new `TemplateEvaluator` instance.
 *
 * @returns A new `TemplateEvaluator` instance.
 */
function createInstance(): TemplateEvaluator {
  return new DefaultTemplateEvaluator()
}

/**
 * The exports of the Quicklid library.
 */
export {
  createInstance,
  defaultEvaluationOptions,
}
