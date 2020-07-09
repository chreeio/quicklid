import { TemplateEvaluator } from './TemplateEvaluator'
import { CompilationOptions } from './CompilationOptions';
import { CompiledTemplate } from './CompiledTemplate';
import { CompiledTemplateEvaluator } from './CompiledTemplateEvaluator'
import { EvaluationOptions } from './EvaluationOptions';

export class DefaultTemplateEvaluator implements TemplateEvaluator {
    private evaluator: CompiledTemplateEvaluator

    constructor() {
        this.evaluator = new CompiledTemplateEvaluator()
    }

    compileExpression(template: String, options?: CompilationOptions): CompiledTemplate {
        throw new Error("Method not implemented.");
    }

    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: EvaluationOptions): string {
        return this.evaluator.evaluateCompiledTemplate(compiledTemplate, substitutionData, options)
    }
}
