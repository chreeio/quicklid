import 'jest'

import { TemplateCompiler } from '../src/evaluator/TemplateCompiler'
import { CompiledTemplate } from '../src/evaluator/CompiledTemplate'

interface TestCase {
    title: string,
    template: string,
    expected?: CompiledTemplate
}

interface SettingGroup {
    [propertyName: string]: TestCase[]
}

interface TestCaseFile {
    [propertyName: string]: SettingGroup
}

const testData: TestCaseFile = require('./TemplateCompiler.testcase.json')

function positiveTest(testCase: TestCase) {
    test(testCase.title, () => {
        // Given
        const underTest = new TemplateCompiler()

        // When
        const actual = underTest.compileTemplate(testCase.template)

        // Then
        expect(actual).toEqual(testCase.expected)
    })
}

function negativeTest(testCase: TestCase) {
    test(testCase.title, () => {
        // Given
        const underTest = new TemplateCompiler()

        // Expect
        expect(() => underTest.compileTemplate(testCase.template))
            .toThrow()
    })
}

describe('Compiler', () => {
    Object.entries(testData).forEach(([settingName, settingGroup]) => {
        describe(settingName, () => {
            Object.entries(settingGroup).forEach(([caseGroupName, testCases]) => {
                describe(caseGroupName, () => {
                    testCases.forEach(testCase => {
                        Object.prototype.hasOwnProperty.call(testCase, 'expected')
                            ? positiveTest(testCase)
                            : negativeTest(testCase)
                    })
                })
            })
        })
    })
})

