import { DefaultTemplateEvaluator } from './evaluator/DefaultTemplateEvaluator'
import { TemplateEvaluator } from './evaluator/TemplateEvaluator'

export function createInstance(): TemplateEvaluator {
    return new DefaultTemplateEvaluator()
}

export { defaultEvaluationOptions } from './evaluator/TemplateEvaluator'
