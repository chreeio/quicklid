import 'jest'

import * as Quicklid from '../src/index'
import { TemplateCompiler } from '../src/evaluator/TemplateCompiler'
import { CompiledTemplate } from '../src/evaluator/CompiledTemplate'

interface TestCase {
    title: string,
    template: string,
    expected: CompiledTemplate
}

describe('Compiler with default settings', () => {
    const testCases: TestCase[] = require('./TemplateCompiler.testcase.json')

    testCases.forEach(testCase => {
        test(testCase.title, () => {
            // Given
            const underTest = new TemplateCompiler()

            // When
            const actual = underTest.compileTemplate(testCase.template, Quicklid.defaultCompilationOptions)

            // Then
            expect(actual).toEqual(testCase.expected)
        })
    })
})
