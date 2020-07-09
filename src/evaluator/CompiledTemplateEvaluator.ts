import { CompiledTemplate, CompiledTemplateFragment, TextFragment, ExpressionFragment } from './CompiledTemplate'
import { EvaluationOptions } from './EvaluationOptions'
import { UnknownPropertyError } from './UnknownPropertyError'

interface ResolutionResult {
    value?: any,
    present: boolean
}

export class CompiledTemplateEvaluator {
    evaluateCompiledTemplate(compiledTemplate: CompiledTemplate, substitutionData: object, options: EvaluationOptions): string {
        const result = compiledTemplate.fragments
            .map(fragment => this.evaluateFragment(fragment, substitutionData, options))
            .join()

        return result
    }

    private evaluateFragment(fragment: CompiledTemplateFragment, substitutionData: object, options: EvaluationOptions): string {
        return this.isTextFragment(fragment)
                ? fragment.text
                : this.evaluateExpressionFragment(fragment, substitutionData, options)
    }

    private evaluateExpressionFragment(fragment: ExpressionFragment, substitutionData: object, options: EvaluationOptions): string {
        const pointerValue = this.evaluatePointerValue(fragment.pointer, substitutionData, options)
    }

    private evaluatePointerValue(pointer: string, substitutionData: object, options: EvaluationOptions): string {
        const resolutionResult = this.resolvePointer(pointer, substitutionData)

        if (!resolutionResult.present && !options.allowUnknownProperties) {
            throw new UnknownPropertyError()
        }

        const property = resolutionResult.present
            ? resolutionResult.value
            : options.unknownPropertyPlaceholder

        return `${property}`
    }

    private resolvePointer(pointer: string, substitutionData: object): ResolutionResult {
        const segments = pointer.split('.')

        let result = substitutionData

        for (const segment of segments) {
            if (typeof result === 'object' && Object.prototype.hasOwnProperty.call(substitutionData, segment)) {
                result = result[segment]
            } else {
                return { present: false}
            }
        }

        return { value: result, present: true }
    }

    private isTextFragment(fragment: CompiledTemplateFragment): fragment is TextFragment {
        return (fragment as TextFragment).text !== undefined
    }
}
