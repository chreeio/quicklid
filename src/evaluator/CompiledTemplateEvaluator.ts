import { CompiledTemplate, CompiledTemplateFragment, TextFragment, ExpressionFragment, CompiledFilter } from './CompiledTemplate'
import { EvaluationOptions } from './EvaluationOptions'
import { UnknownFilterError } from './UnknownFilterError'
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

        return fragment.filters
            .reduce((input, filter) => this.evaluateFilter(input, filter, options), pointerValue)
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

    private evaluateFilter(input: string, filter: CompiledFilter, options: EvaluationOptions): string {
        const resolutionResult = this.resolveFilter(input, filter, options)

        if (!resolutionResult.present && options.allowUnknownFilters) {
            throw new UnknownFilterError()
        }

        const value = resolutionResult.present
            ? resolutionResult.value
            : options.unknownFilterPlaceholder(input, filter.args)

        return value
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

    private resolveFilter(input: string, filter: CompiledFilter, options: EvaluationOptions): ResolutionResult {
        const filterFunction = options.filters[filter.name]

        if (!filterFunction) {
            return { present: false }
        }

        return { value: filterFunction(input, filter.args), present: true }
    }

    private isTextFragment(fragment: CompiledTemplateFragment): fragment is TextFragment {
        return (fragment as TextFragment).text !== undefined
    }
}