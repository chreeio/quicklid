import { CompilationOptions } from "./CompilationOptions";
import { CompiledTemplate, CompiledTemplateFragment, TextFragment } from "./CompiledTemplate";
import { tokens } from './TemplateEvaluator'

const NOT_FOUND = -1

export class TemplateCompiler {
    compileTemplate(template: String, options: CompilationOptions): CompiledTemplate {
        const fragments: CompiledTemplateFragment[] = []

        let lastPosition = 0
        let skipPosition = 0
        let nextExpressionStart = -1

        while ((nextExpressionStart = template.indexOf(tokens.EXPRESSION_BEGIN, skipPosition)) !== NOT_FOUND) {
            if ((nextExpressionStart - 1) > 0 && (template[nextExpressionStart - 1] == tokens.ESCAPE_CHARACTER)) {
                skipPosition += tokens.EXPRESSION_BEGIN.length
            }

            fragments.push({ text: template.substring(lastPosition, nextExpressionStart) } as TextFragment)
        }

        fragments.push({ text: template.substring(lastPosition, template.length) } as TextFragment)
        
        return {
            fragments
        }
    }
}
