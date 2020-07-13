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
    compileTemplate(template: String, options?: Partial<CompilationOptions>): CompiledTemplate

    /**
     * throws UnknownFilterError, throws UnknownPropertyError
     * @param compiledTemplate 
     * @param substitutionData 
     * @param options 
     */
    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options?: Partial<EvaluationOptions>): string    
}

/**
 * 
 */
export const defaultCompilationOptions: Readonly<CompilationOptions> = {
    requireColonAfterFilter: true,
    requireCommaBetweenArgs: true
}

/**
 * 
 */
export const defaultEvaluationOptions: Readonly<EvaluationOptions> = {
    allowUnknownProperties: true,

    unknownPropertyPlaceholder: 'undefined',

    allowUnknownFilters: true,

    unknownFilterPlaceholder(input: string, args: string[]): string {
        return input
    },

    filters: {}
}
