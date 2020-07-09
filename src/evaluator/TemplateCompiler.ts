import { CompilationOptions } from "./CompilationOptions";
import { CompiledTemplate, CompiledTemplateFragment, TextFragment, ExpressionFragment } from "./CompiledTemplate";
import { tokens } from './TemplateEvaluator'

const NOT_FOUND = -1

export class TemplateCompiler {
    private static readonly ESCAPED_EXPRESSION_BEGIN_REGEXP = new RegExp(tokens.ESCAPE_CHARACTER + tokens.EXPRESSION_BEGIN, 'g')

    compileTemplate(template: String, options: CompilationOptions): CompiledTemplate {
        const fragments: CompiledTemplateFragment[] = []

        let lastPosition = 0
        let skipPosition = 0
        let nextExpressionStart = -1

        while ((nextExpressionStart = template.indexOf(tokens.EXPRESSION_BEGIN, skipPosition)) !== NOT_FOUND) {
            if ((nextExpressionStart - 1) > 0 && (template[nextExpressionStart - 1] == tokens.ESCAPE_CHARACTER)) {
                skipPosition += tokens.EXPRESSION_BEGIN.length
                continue
            }

            fragments.push({ text: template.substring(lastPosition, nextExpressionStart) } as TextFragment)

            let currentExpressionEnd = template.indexOf(tokens.EXPRESSION_END, nextExpressionStart)
            let firstFilterStart = template.indexOf(tokens.FILTER_DELIMITER, nextExpressionStart)

            if (currentExpressionEnd != NOT_FOUND) {
                if (firstFilterStart == NOT_FOUND || firstFilterStart > currentExpressionEnd) {
                    const pointer = template.substring(
                        nextExpressionStart + tokens.EXPRESSION_BEGIN.length,
                        currentExpressionEnd
                    ).trim()

                    const pointerSegments = pointer.split(tokens.POINTER_SEGMENT_SEPARATOR)

                    fragments.push({ pointerSegments, filters: [] } as ExpressionFragment)

                    lastPosition = currentExpressionEnd + tokens.EXPRESSION_END.length
                    skipPosition = lastPosition
                    continue
                }
            }

            if (firstFilterStart != NOT_FOUND) {
                const pointer = template.substring(
                    nextExpressionStart + tokens.EXPRESSION_BEGIN.length,
                    firstFilterStart
                ).trim()

                const pointerSegments = pointer.split(tokens.POINTER_SEGMENT_SEPARATOR)
            }

            throw new Error('No closing }} for beginning {{!')
        }

        fragments.push({ text: template.substring(lastPosition, template.length) } as TextFragment)

        this.replaceEscapedExpressionBegins(fragments)
        
        return {
            fragments
        }
    }

    private replaceEscapedExpressionBegins(fragments: CompiledTemplateFragment[]) {
        fragments
            .filter(fragment => this.isTextFragment(fragment))
            .forEach(fragment => {
                const tf = fragment as TextFragment
                tf.text = tf.text.replace(TemplateCompiler.ESCAPED_EXPRESSION_BEGIN_REGEXP, tokens.EXPRESSION_BEGIN)
            })
    }

    private isTextFragment(fragment: CompiledTemplateFragment): fragment is TextFragment {
        return (fragment as TextFragment).text !== undefined
    }
}
