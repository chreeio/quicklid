/**
 * A filter function which takes an input string along with a possibly empty list
 * of arguments and transforms the input.
 */
export interface FilterFunction {
  (input: string, args: string[]): string
}
