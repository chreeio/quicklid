/**
 * 
 */
export interface CompiledFilter {
    /**
     * 
     */
    name: string,

    /**
     * 
     */
    args: string[]
}

/**
 * 
 */
export interface TextFragment {
    /**
     * 
     */
    text: string
}

/**
 * 
 */
export interface ExpressionFragment {
    pointerSegments: string[],
    filters: CompiledFilter[]
}

/**
 * 
 */
export type CompiledTemplateFragment = TextFragment | ExpressionFragment

/**
 * 
 */
export interface CompiledTemplate {
    /**
     * 
     */
    fragments: CompiledTemplateFragment[]
}
