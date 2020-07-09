import { EvaluationOptions } from './EvaluationOptions';

import { CompiledTemplate } from './CompiledTemplate'

/**
 * 
 */
export interface TemplateEvaluator {
    /**
     * 
     * @param template 
     */
    compileExpression(template: String): CompiledTemplate

    /**
     * throws UnknownFilterError, throws UnknownPropertyError
     * @param compiledTemplate 
     * @param substitutionData 
     * @param options 
     */
    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: EvaluationOptions): string
}
