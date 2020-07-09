import { TemplateEvaluator, defaultCompilationOptions, defaultEvaluationOptions } from './TemplateEvaluator'
import { CompilationOptions } from './CompilationOptions';
import { CompiledTemplate } from './CompiledTemplate';
import { CompiledTemplateEvaluator } from './CompiledTemplateEvaluator'
import { EvaluationOptions } from './EvaluationOptions';

export class DefaultTemplateEvaluator implements TemplateEvaluator {
    private evaluator: CompiledTemplateEvaluator

    constructor() {
        this.evaluator = new CompiledTemplateEvaluator()
    }

    compileExpression(template: String, options?: Partial<CompilationOptions>): CompiledTemplate {
        throw new Error("Method not implemented.");
    }

    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: Partial<EvaluationOptions>): string {
        const setOptions: EvaluationOptions = { ...defaultEvaluationOptions, ...(options || {}) }

        return this.evaluator.evaluateCompiledTemplate(compiledTemplate, substitutionData, setOptions)
    }
}
