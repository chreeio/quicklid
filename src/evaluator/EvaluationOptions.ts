import { FilterFunction } from './FilterFunction'

/**
 * 
 */
export interface EvaluationOptions {
    /**
     * 
     */
    allowUnknownProperties: boolean

    /**
     * 
     */
    unknownPropertyPlaceholder: string

    /**
     * 
     */
    allowUnknownFilters: boolean

    /**
     * 
     */
    unknownFilterPlaceholder: FilterFunction
}
