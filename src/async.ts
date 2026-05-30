import path from 'node:path';
import type { Processor, Transformer, Preset, Plugin } from 'unified';
import type { Root, Code } from 'mdast';
import remarkDirective from 'remark-directive';
import type { VFile } from 'vfile';
import {
  parse as parseEditorConfig
} from 'editorconfig';
import {
  getIncludeDirectives, assertFileDirnameIsDefined,
  assertErrorIsVFileMessage
} from './lib/library.ts';
import { type IParameters, Options } from './lib/options.ts';
import { CodeFileContent } from './lib/code-content.ts';

/**
 * Async Remark plugin fabric function.
 *
 * The `@it-service-npm/remark-include-code` package allows you
 * to embed code files within your Markdown documents.
 *
 * This plugin allows you to incorporate code into your markdown using the
 * `::include-code{file="./included.ts"}`
 * syntax.
 *
 * @public
 */
export const remarkIncludeCode: Plugin<
  [IParameters?],
  Root
> = function (
  this: Processor,
  parameters?: IParameters
): Transformer<Root> {

    return async function (tree: Root, file: VFile): Promise<Root> {
      const includeDirectives = getIncludeDirectives(tree, file);
      assertFileDirnameIsDefined(file);
      const fileDirname = path.resolve(file.dirname);
      for (const includeDirective of includeDirectives) {
        const includedContent: Code[] = [];
        try {
          const options = new Options(
            file, includeDirective.node,
            '`::include-code`',
            parameters
          );
          const includedFilePath = path.resolve(fileDirname, options.file);
          if (options.useEditorConfig) {
            options.editorConfig = await parseEditorConfig(includedFilePath);
          }
          const includedFileContent = await CodeFileContent.readFile(
            file, includeDirective.node, options,
            includedFilePath
          );
          includedFileContent
            .decode()
            .normalizeEOL()
            .trimFinalNewline()
            .selectLinesRange()
            .replaceTabs()
            .normalizeIndent();
          includedContent.push({
            type: 'code',
            lang: options.language,
            value: includedFileContent.content
          });
        } catch (error) {
          assertErrorIsVFileMessage(error);
        }
        includeDirective.parent.children.splice(
          includeDirective.index, 1,
          ...includedContent
        );
      }
      return tree;
    };
  };

/**
 * Preset of Remark plugins:
 *
 * - {@link remarkIncludeCode}
 *
 * - {@link https://www.npmjs.com/package/remark-directive|remarkDirective}
 *
 * @public
 */
export const remarkIncludeCodePreset: Preset = {
  plugins: [
    remarkDirective,
    [remarkIncludeCode, {
      trimFinalNewline: true
    }]
  ]
};
