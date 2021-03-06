import { TemplateEvaluator, defaultEvaluationOptions } from './TemplateEvaluator'
import { CompiledTemplate } from '../compiler/CompiledTemplate'
import { CompiledTemplateEvaluator } from './CompiledTemplateEvaluator'
import { EvaluationOptions } from './EvaluationOptions'
import { TemplateCompiler } from '../compiler/TemplateCompiler'

/**
 * Default implementation of the `TemplateEvaluator` interface. Uses
 * delegation for template compilation and evaluation.
 */
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
    substitutionData: Record<string, unknown>,
    options?: Partial<EvaluationOptions>
  ): string {
    const setOptions: EvaluationOptions = { ...defaultEvaluationOptions, ...(options || {}) }

    return this.evaluator.evaluateCompiledTemplate(compiledTemplate, substitutionData, setOptions)
  }
}
