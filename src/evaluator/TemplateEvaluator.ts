import { CompilationOptions } from './CompilationOptions'
import { EvaluationOptions } from './EvaluationOptions'

import { CompiledTemplate } from './CompiledTemplate'

/**
 * 
 */
export interface TemplateEvaluator {
    /**
     * throws TemplateSyntaxError
     * @param template 
     */
    compileExpression(template: String, options?: CompilationOptions): CompiledTemplate

    /**
     * throws UnknownFilterError, throws UnknownPropertyError
     * @param compiledTemplate 
     * @param substitutionData 
     * @param options 
     */
    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: EvaluationOptions): string
}
