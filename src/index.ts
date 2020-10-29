import { TemplateEvaluator, DefaultTemplateEvaluator } from './evaluator'

export function quicklid(): TemplateEvaluator {
  return new DefaultTemplateEvaluator()
}

export {
  CompiledFilter,
  TextFragment,
  ExpressionFragment,
  CompiledTemplateFragment,
  CompiledTemplate,
  TemplateSyntaxError,
  TemplateSyntaxErrorType,
} from './compiler'

export {
  EvaluationOptions,
  defaultEvaluationOptions,
  FilterFunction,
  TemplateEvaluator,
  UnknownFilterError,
  UnknownPropertyError,
} from './evaluator'
