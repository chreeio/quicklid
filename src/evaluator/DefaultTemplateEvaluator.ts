import { TemplateEvaluator, defaultCompilationOptions, defaultEvaluationOptions } from './TemplateEvaluator'
import { CompilationOptions } from './CompilationOptions';
import { CompiledTemplate } from './CompiledTemplate';
import { CompiledTemplateEvaluator } from './CompiledTemplateEvaluator'
import { EvaluationOptions } from './EvaluationOptions';
import { TemplateCompiler } from './TemplateCompiler';

export class DefaultTemplateEvaluator implements TemplateEvaluator {
    private readonly compiler: TemplateCompiler
    private readonly evaluator: CompiledTemplateEvaluator

    constructor() {
        this.compiler = new TemplateCompiler()
        this.evaluator = new CompiledTemplateEvaluator()
    }

    compileTemplate(template: String, options?: Partial<CompilationOptions>): CompiledTemplate {
        const setOptions: CompilationOptions = { ...defaultCompilationOptions, ...(options || {}) }

        return this.compiler.compileTemplate(template, setOptions)
    }

    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: Partial<EvaluationOptions>): string {
        const setOptions: EvaluationOptions = { ...defaultEvaluationOptions, ...(options || {}) }

        return this.evaluator.evaluateCompiledTemplate(compiledTemplate, substitutionData, setOptions)
    }
}
