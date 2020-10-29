/**
 * Compiled representation of a filter, which does not contain actual filter
 * function implementation.
 */
export interface CompiledFilter {
  /**
   * The name of the filter. Will be used when searching for a filter function.
   */
  name: string

  /**
   * The arguments of the filter execution.
   */
  args: string[]
}

/**
 * A text fragment inside a compiled template.
 */
export interface TextFragment {
  /**
   * The actual text content of the fragment.
   */
  text: string
}

/**
 * An expression (pointer to some property and an optional filter chain) fragment
 * inside a compiled template.
 */
export interface ExpressionFragment {
  /**
   * The property pointer split into segments for easier access.
   */
  pointerSegments: string[]

  /**
   * A chain of filters to apply to the pointed value.
   */
  filters: CompiledFilter[]
}

/**
 * Fragments that a compiled template can consist of.
 */
export type CompiledTemplateFragment = TextFragment | ExpressionFragment

/**
 * A text template broken up into text and expression
 * fragments for fast evaluation.
 */
export interface CompiledTemplate {
  /**
   * A list of fragments that build up the template.
   */
  fragments: CompiledTemplateFragment[]
}
