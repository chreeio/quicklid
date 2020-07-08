import { FilterFunction } from './FilterFunction'

/**
 * 
 */
export interface TemplateEvaluatorOptions {
    /**
     * 
     */
    allowUnknownProperties?: boolean

    /**
     * 
     */
    unknownPropertyPlaceholder?: string

    /**
     * 
     */
    allowUnknownFilters?: boolean

    /**
     * 
     */
    unknownFilterPlaceholder?: FilterFunction
}
