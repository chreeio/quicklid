import { TemplateEvaluator } from './TemplateEvaluator'
import { CompilationOptions } from './CompilationOptions';
import { CompiledTemplate } from './CompiledTemplate';
import { EvaluationOptions } from './EvaluationOptions';

export class DefaultTemplateEvaluator implements TemplateEvaluator {
    compileExpression(template: String, options?: CompilationOptions): CompiledTemplate {
        throw new Error("Method not implemented.");
    }
    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: EvaluationOptions): string {
        throw new Error("Method not implemented.");
    }
}
