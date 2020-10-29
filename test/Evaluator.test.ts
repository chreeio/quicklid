import 'jest'

import { quicklid } from '../src'

describe('Evaluator', () => {
  test('Text without template expressions is returned as-is.', () => {
    // Given
    const q = quicklid()
    const expected = 'Hello, World!'

    // When
    const compiled = q.compileTemplate('Hello, World!')
    const actual = q.evaluateCompiledTemplate(compiled, {})

    // Then
    expect(actual).toBe(expected)
  })

  test('If unknown properties are allowed then they should be substituted for the set value.', () => {
    // Given
    const q = quicklid()
    const expected = 'missing'
    const placeholder = 'missing'

    // When
    const compiled = q.compileTemplate('{{ property }}')
    const actual = q.evaluateCompiledTemplate(
      compiled,
      {},
      {
        allowUnknownProperties: true,
        unknownPropertyPlaceholder: placeholder,
      }
    )

    // Then
    expect(actual).toBe(expected)
  })

  test('If unknown filters are allowed then they should be substituted for the set function.', () => {
    // Given
    const q = quicklid()
    const placeholder = jest.fn(() => 'hello')
    const expected = 'hello'

    // When
    const compiled = q.compileTemplate('{{ property |  filter }}')
    const actual = q.evaluateCompiledTemplate(
      compiled,
      { property: 'does not matter' },
      {
        allowUnknownFilters: true,
        unknownFilterPlaceholder: placeholder,
      }
    )

    // Then
    expect(placeholder).toBeCalledTimes(1)
    expect(actual).toBe(expected)
  })

  test('If unknown properties are not allowed then an UnknownPropertyError should be thrown.', () => {
    // Given
    const q = quicklid()

    // Expect
    expect(() => {
      const compiled = q.compileTemplate('{{ property }}')
      q.evaluateCompiledTemplate(
        compiled,
        {},
        {
          allowUnknownProperties: false,
        }
      )
    }).toThrow(/Unknown property: property/)
  })

  test('If unknown filters are not allowed then an UnknownFilterError should be thrown.', () => {
    // Given
    const q = quicklid()

    // Expect
    expect(() => {
      const compiled = q.compileTemplate('{{ property | filter  }}')
      q.evaluateCompiledTemplate(
        compiled,
        { property: 'does not matter' },
        {
          allowUnknownFilters: false,
        }
      )
    }).toThrow(/Unknown filter: filter/)
  })

  test('It should work correctly for a filter chain with no arguments.', () => {
    // Given
    const q = quicklid()
    const expected = 'Hello, EOJ!'

    // When
    const compiled = q.compileTemplate('Hello, {{ name | uppercase | reverse  }}!')
    const actual = q.evaluateCompiledTemplate(
      compiled,
      { name: 'joe' },
      {
        filters: {
          uppercase(input) {
            return input.toUpperCase()
          },
          reverse(input) {
            return input.split('').reverse().join('')
          },
        },
      }
    )

    // Then
    expect(actual).toBe(expected)
  })

  test('It should work correctly for a filter chain with arguments.', () => {
    // Given
    const q = quicklid()
    const expected = 'Hello, Joe!'

    // When
    const compiled = q.compileTemplate('{{ name | prepend: "Hello, " | append: "!"  }}')
    const actual = q.evaluateCompiledTemplate(
      compiled,
      { name: 'Joe' },
      {
        filters: {
          prepend(input, args) {
            return args[0] + input
          },
          append(input, args) {
            return input + args[0]
          },
        },
      }
    )

    // Then
    expect(actual).toBe(expected)
  })

  test('It should work correctly for a filter chain with multiple arguments.', () => {
    // Given
    const q = quicklid()
    const expected = 'Joy'

    // When
    const compiled = q.compileTemplate('{{ name | replace: "e", "y"  }}')
    const actual = q.evaluateCompiledTemplate(
      compiled,
      { name: 'Joe' },
      {
        filters: {
          replace(input, args) {
            return input.replace(args[0], args[1])
          },
        },
      }
    )

    // Then
    expect(actual).toBe(expected)
  })
})
