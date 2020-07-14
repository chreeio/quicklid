import { TemplateEvaluator, defaultEvaluationOptions } from './TemplateEvaluator'
import { CompiledTemplate } from './CompiledTemplate'
import { CompiledTemplateEvaluator } from './CompiledTemplateEvaluator'
import { EvaluationOptions } from './EvaluationOptions'
import { TemplateCompiler } from './TemplateCompiler'

export class DefaultTemplateEvaluator implements TemplateEvaluator {
  private readonly compiler: TemplateCompiler
  private readonly evaluator: CompiledTemplateEvaluator

  constructor() {
    this.compiler = new TemplateCompiler()
    this.evaluator = new CompiledTemplateEvaluator()
  }

  compileTemplate(template: string): CompiledTemplate {
    return this.compiler.compileTemplate(template)
  }

  evaluateCompiledTemplate(
    compiledTemplate: CompiledTemplate,
    substitutionData: object,
    options?: Partial<EvaluationOptions>
  ): string {
    const setOptions: EvaluationOptions = { ...defaultEvaluationOptions, ...(options || {}) }

    return this.evaluator.evaluateCompiledTemplate(compiledTemplate, substitutionData, setOptions)
  }
}
