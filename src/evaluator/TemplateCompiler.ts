import { CompilationOptions } from "./CompilationOptions";
import { CompiledTemplate, CompiledTemplateFragment, TextFragment, ExpressionFragment, CompiledFilter } from "./CompiledTemplate";
import { tokens } from './TemplateEvaluator'

enum TokenType {
    EXPRESSION_BEGIN = '{{',
    EXPRESSION_END = '}}',
    STRING_DELIMITER = '"',
    ARGUMENTS_BEGIN = ':',
    ARGUMENT_DELIMITER = ',',
    FILTER_DELIMITER = '|',
    POINTER_SEGMENT_SEPARATOR = '.',
    ESCAPE_CHARACTER = '\\'
}

interface TokenMatch {
    position: number,
    type: TokenType
}

const TOKEN_NOT_FOUND: TokenMatch = null

export class TemplateCompiler {
    private static readonly ESCAPED_EXPRESSION_BEGIN_REGEXP = new RegExp('\\' + tokens.ESCAPE_CHARACTER + tokens.EXPRESSION_BEGIN, 'g')

    private static readonly POINTER_REGEXP = /^[a-zA-Z0-9_\.\-]+$/g

    compileTemplate(template: string, options: CompilationOptions): CompiledTemplate {
        const fragments: CompiledTemplateFragment[] = []

        let lastPosition = 0
        let nextExpressionStart = -1

        let nextToken: TokenMatch = TOKEN_NOT_FOUND

        while ((nextToken = this.nextSignificantToken(template, lastPosition, false, false)) !== TOKEN_NOT_FOUND) {
            nextExpressionStart = nextToken.position

            fragments.push({ text: template.substring(lastPosition, nextExpressionStart) })

            nextToken = this.nextSignificantToken(template, nextToken.position + 1, true, false)
            if (!nextToken) {
                throw new Error('nooooo')
            }

            if (nextToken.type === TokenType.EXPRESSION_END) {
                const pointer = template.substring(
                    nextExpressionStart + tokens.EXPRESSION_BEGIN.length,
                    nextToken.position
                ).trim()
                this.validatePointer(pointer)

                const pointerSegments = pointer.split(tokens.POINTER_SEGMENT_SEPARATOR)
                fragments.push({ pointerSegments, filters: [] })

                lastPosition = nextToken.position + tokens.EXPRESSION_END.length
            } else if (nextToken.type === TokenType.FILTER_DELIMITER) {
                const pointer = template.substring(
                    nextExpressionStart + tokens.EXPRESSION_BEGIN.length,
                    nextToken.position
                ).trim()
                this.validatePointer(pointer)

                const pointerSegments = pointer.split(tokens.POINTER_SEGMENT_SEPARATOR)
                const { filters, endPosition } = this.parseFilters(template, nextToken.position + 1)
                fragments.push({ pointerSegments, filters } as ExpressionFragment)

                lastPosition = endPosition
            } else {
                throw new Error('No closing }} for beginning {{!')
            }
        }

        fragments.push({ text: template.substring(lastPosition, template.length) } as TextFragment)

        this.replaceEscapedExpressionBegins(fragments)
        
        return {
            fragments: this.removeEmptyTextFragments(fragments)
        }
    }

    private parseFilters(template: string, firstFilterStart: number): { filters: CompiledFilter[], endPosition: number } {
        const filters: CompiledFilter[] = []

        let lastPosition = firstFilterStart

        let filterName: string = null
        let args: string[] = null

        let nextToken: TokenMatch = null
        while ((nextToken = this.nextSignificantToken(template, lastPosition, true, false)) !== TOKEN_NOT_FOUND) {
            switch (nextToken.type) {
                case TokenType.EXPRESSION_END:
                    if (!filterName) {
                        filterName = template.substring(lastPosition, nextToken.position).trim()
                    }

                    filters.push({
                        name: filterName,
                        args
                    })

                    filterName = null
                    args = []
                    lastPosition = nextToken.position + 2
                    break

                case TokenType.FILTER_DELIMITER:
                    if (!filterName) {
                        filterName = template.substring(lastPosition, nextToken.position).trim()
                    }

                    filters.push({
                        name: filterName,
                        args
                    })

                    filterName = null
                    args = []
                    lastPosition = nextToken.position + 1
                    break

                case TokenType.ARGUMENTS_BEGIN:
                    filterName = template.substring(lastPosition, nextToken.position).trim()
                    const argsParseResult = this.parseFilterArgs(template, nextToken.position + 1)

                    args = argsParseResult.args

                    lastPosition = argsParseResult.endPosition
                    break

                default:
                    throw new Error('Unexpected token')
            }
        }

        return {
            filters,
            endPosition: lastPosition
        }
    }

    private parseFilterArgs(template: string, firstArgumentStart: number): { args: string[], endPosition: number } {
        const args: string[] = []

        let lastPosition = firstArgumentStart
        let argumentStart = firstArgumentStart
        let argumentPushed = false

        let shouldContinue = true
        while (shouldContinue) {
            let nextToken = this.nextSignificantToken(template, lastPosition, true, false)

            switch (nextToken.type) {
                case TokenType.ARGUMENT_DELIMITER:
                    if (!argumentPushed) {
                        args.push(template.substring(argumentStart, nextToken.position).trim())
                    }
                
                    argumentPushed = false
                    lastPosition = nextToken.position + 1
                    argumentStart = lastPosition
                    break

                case TokenType.STRING_DELIMITER:
                    const stringStart = nextToken.position + 1
                    const stringEndToken = this.nextSignificantToken(template, nextToken.position + 1, true, true)

                    args.push(template.substring(stringStart, stringEndToken.position))

                    argumentPushed = true
                    lastPosition = stringEndToken.position + 1
                    break

                case TokenType.EXPRESSION_END:
                case TokenType.FILTER_DELIMITER:
                    if (!argumentPushed) {
                        args.push(template.substring(argumentStart, nextToken.position).trim())
                    }

                default:
                    shouldContinue = false
                    break
            }
        }

        return {
            args,
            endPosition: lastPosition
        }
    }

    private validatePointer(pointer: string) {
        if (!pointer.match(TemplateCompiler.POINTER_REGEXP)) {
            throw new Error('Invalid pointer syntax')
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

    private removeEmptyTextFragments(fragments: CompiledTemplateFragment[]): CompiledTemplateFragment[] {
        return fragments.filter(fragment => {
            if (this.isTextFragment(fragment)) {
                return fragment.text != ''
            } else {
                return true
            }
        })
    }

    private isTextFragment(fragment: CompiledTemplateFragment): fragment is TextFragment {
        return (fragment as TextFragment).text !== undefined
    }

    
    private nextSignificantToken(template: string, from: number = 0, isInsideExpression: boolean = false, isInsideString: boolean = false): TokenMatch {
        let index = from
        while (index < template.length) {
            if (!isInsideExpression) {
                if (this.isNonEscapedExpressionBegin(template, index)) {
                    return {
                        position: index,
                        type: TokenType.EXPRESSION_BEGIN
                    }
                } else if (this.isExpressionBegin(template, index)) {
                    ++index
                }
            } else {
                if (isInsideString) {
                    if (this.isNonEscapedStringDelimiter(template, index)) {
                        return {
                            position: index,
                            type: TokenType.STRING_DELIMITER
                        }
                    }
                } else {
                    switch (template.charAt(index)) {
                        case '{':
                            if (this.isNonEscapedExpressionBegin(template, index)) {
                                return {
                                    position: index,
                                    type: TokenType.EXPRESSION_BEGIN
                                }
                            } else if (this.isExpressionBegin(template, index)) {
                                ++index
                            }

                            break
                        case '}':
                            if (this.isExpressionEnd(template, index)) {
                                return {
                                    position: index,
                                    type: TokenType.EXPRESSION_END
                                }
                            }

                            break
                        case '"':
                            if (this.isNonEscapedStringDelimiter(template, index)) {
                                return {
                                    position: index,
                                    type: TokenType.STRING_DELIMITER
                                }
                            }

                            break
                        case ':':
                            return {
                                position: index,
                                type: TokenType.ARGUMENTS_BEGIN
                            }
                        case ',':
                            return {
                                position: index,
                                type: TokenType.ARGUMENT_DELIMITER
                            }
                        case '|':
                            return {
                                position: index,
                                type: TokenType.FILTER_DELIMITER
                            }
                    }
                }
            }
            ++index
        }

        return null
    }

    private isNonEscapedStringDelimiter(template: string, index: number): boolean {
        return template.charAt(index - 1) !== TokenType.ESCAPE_CHARACTER
            && template.charAt(index) === TokenType.STRING_DELIMITER
    }

    private isExpressionBegin(template: string, index: number): boolean {
        return template.charAt(index) === '{'
            && template.charAt(index + 1) === '{'
    }

    private isNonEscapedExpressionBegin(template: string, index: number): boolean {
        return template.charAt(index - 1) !== TokenType.ESCAPE_CHARACTER
            && template.charAt(index) === '{'
            && template.charAt(index + 1) === '{'
    }

    private isExpressionEnd(template: string, index: number): boolean {
        return template.charAt(index + 1) === '}'
    }
}
