# quicklid

[![Build Master status](https://github.com/chreeio/quicklid/workflows/Build%20Master/badge.svg)](https://github.com/chreeio/quicklid/actions?query=workflow%3A%22Build+Master%22)
[![npm version](https://img.shields.io/npm/v/@chreeio/quicklid)](https://www.npmjs.com/package/@chreeio/quicklid)
[![LICENCE](https://img.shields.io/github/license/chreeio/quicklid)](LICENSE)

A [Liquid](https://shopify.github.io/liquid/)-like string expression evaluator.

## Installation

~~~~
npm i @chreeio/quicklid
~~~~

## Features

  * A small, trimmed down version of Liquid:
    * Only built-in objects and filters.
    * Thus, there are no variables, control flow, partials whatsoever.
  * Custom subsitution data and filters.
    * You can ship your own library of filters.
  * Ability to handle missing properties and filters gracefully or with an error.
  * Compiled templates for faster subsequent evaluation.

## Usage

~~~~TypeScript
import { quicklid } from '@chreeio/quicklid'

// Create a new instance of quicklid.
const q = quicklid()

// Define substitution data for templating.
const substitution = {
  user: {
    name: 'joe'
  }
}

// Define a library of filters.
const filters = {
  upcase(input) {
    return input.toUpperCase()
  },
  append(input, args) {
    return input + args[0]
  }
}

// Compile the template string. The compiled result can
// be evaluated any number of times against different substitution data
// and filters.
const compiled = q.compileTemplate('Hello, {{ user.name | upcase | append: ", my man" }}!')

// Evaluate the compiled template into a string.
const result = q.evaluateCompiledTemplate(compiled, substitution, {
    filters
})

// Prints "Hello, JOE, my man!"
console.log(result)
~~~~

Please take a look at the [Evaluator tests](test/Evaluator.test.ts) for more examples.

## Template Syntax and Semantics

Here you find the template syntax accepted by quicklid.

### Expressions

Expressions should be written between a pair of `{{` and `}}`. Whitespace after the opening `{{` and before the closing `}}` is optional.

Examples:

~~~~
Hello, {{ name }}!
~~~~

~~~~
Hello, {{name}}!
~~~~

### Substitutions

Each expression must name a substitution. A substitution is a dotted path in the substitution object specified in evaluation time.

For example, the `user.name` substitution is resolved to `Joe` when evaluated against the

~~~~JavaScript
const substitution = {
    user: {
        name: 'Joe'
    }
}
~~~~

object.

### Filters

A substitution can be followed by an arbitrary number of filters, separated by `|`. The whole expression, starting from the substitution can be thought of as a pipeline: The resolved value of the substitution is fed into the first filter. Then, the output of this filter becomes the input of the second filter and so on. The output of the last filter is evaluated value of the expression itself.

Let's take the following example:

~~~~
{{ user.name | upcase | reverse }}
~~~~

Here, quicklid will perform the following steps:

  1. Resolve the value of the `user.name` substitution.
  1. Execute the `upcase` filter on the resolved value.
  1. Execute the `reverse` filter on the output of the `upcase` filter.
  1. Replace the expression with the output of the `reverse` filter.

#### Filter Arguments

Filters may take any number of arguments, adhering to the following syntax:

  * A colon (`:`) is placed right after the name of the filter.
  * Arguments are separated by commas (`,`).
  * String arguments are enclosed within double quotes (`"`).
  * Numeric arguments are written as-is.

For example:

~~~~
{{ user.name | repeat: 2 | replace: "a", "b" }}
~~~~

## API

### compileTemplate(template)

Takes a template string and compiles it into an easy-to-evaluate format. This speeds up multiple evaluations of the same template string.

The compiled representation is independent from filters and substitutions. It's just a structured representation of the template string.

**Parameters**

  * `template: string`
    * The template string to compile.

**Return Value**

Returns `CompiledTemplate`.

**Error Handling**

If the specified string template is ill-formed, then throws `TemplateSyntaxError`.

### evaluateCompiledTemplate(compiledTemplate, substitutionData, options?)

Evaluates the specified template against the passed subsitution data. The filter functions and the exact behavior of the evaluation can be set through the `options` parameter.

**Parameters**

  * `compiledTemplate: CompiledTemplate`
    * The compiled template to substitute into.
  * `substitutionData: Record<string, unknown>`
    * An object containing the data that should be used when resolving substitutions.
  * `options?: Partial<EvaluationOptions>`
    * Additional options for the evaluation. For example, the filter functions

**Return Value**

Returns `string`.

**Error Handling**

If unknown properties are not allowed and a resolution fails, then throws `UnknownPropertyError`.

If unknown filters are not allowed and a filter name is not found, then throws `UnknownFilterError`.

### EvaluationOptions

| Option | Descripton |
|----------|-------------|
| **allowUnknownProperties** |  Whether to allow unknown properties. If set to `false`, then an `UnknownPropertyError` will be thrown if an unknown property is found. Unknown means, that a pointed property is not present on the substitution object. |
| **unknownPropertyPlaceholder** | If the `allowUnknownProperties` is set to `true`, then this string is going to be substituted in place of unknown properties. |
| **allowUnknownFilters** | Whether to allow unknown filters. If set to `false`, then an `UnknownFilterError` will be thrown if an unknown filter is found. Unknown means, that there is no function in the `filters` object for the specified name. |
| **unknownFilterPlaceholder** | If the `allowUnknownFilters` is set to `true`, then this function is going to be used in place of any unknown filter. |
| **filters** | A mapping of `FilterFunction`s to filter names. |

### FilterFunction

~~~~TypeScript
(input: string, args: string[]): string
~~~~

A filter function which takes an input string along with a possibly empty list of arguments and transforms the input.

The input string is the output of the previous filter or the substitution value itself. The args array contains the comma-separated arguments. Numeric arguments are placed as-is in string format, while string arguments will not contain the enclosing double quotes.

The return value is the output of the filter, passed along the pipeline.

## Acknowledgements

This is an open source project maintained by [Chree](https://chree.io). For more projects maintained or supported by Chree, please head over to the [Chree Open Source page](https://opensource.chree.io).

## Licence

This package is licensed under [MIT](LICENSE).
