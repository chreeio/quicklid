import { DefaultTemplateEvaluator } from './evaluator/DefaultTemplateEvaluator'
import { defaultEvaluationOptions, TemplateEvaluator } from './evaluator/TemplateEvaluator'

function createInstance(): TemplateEvaluator {
    return new DefaultTemplateEvaluator()
}

export default {
    createInstance,
    defaultEvaluationOptions
}
