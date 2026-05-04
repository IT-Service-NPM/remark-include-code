import path from 'node:path';
import type { Processor, Transformer, Preset, Plugin } from 'unified';
import type { Root, Code } from 'mdast';
import remarkDirective from 'remark-directive';
import type { VFile } from 'vfile';
import {
  parseSync as parseEditorConfigSync
} from 'editorconfig';
import {
  getIncludeDirectives, assertFileDirnameIsDefined,
  catchVFileMessages
} from './library.js';
import {
  type IParameters,
  getOptions, updateOptionsWithEditorconfig
} from './options.js';
import { CodeFileContent } from './code-content.js';

/**
 * Sync Remark plugin fabric function.
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

    // const processor: Processor = this;

    return function (tree: Root, file: VFile): Root {
      const includeDirectives = getIncludeDirectives(tree, file);
      assertFileDirnameIsDefined(file);
      const fileDirname = path.resolve(file.dirname);
      for (const includeDirective of includeDirectives) {
        const includedContent: Code[] = [];
        try {
          const options = getOptions(
            file, includeDirective.node,
            parameters
          );
          const includedFilePath = path.resolve(fileDirname, options.file);
          if (options.useEditorConfig) {
            updateOptionsWithEditorconfig(
              file, includeDirective.node,
              parameters, options,
              parseEditorConfigSync(includedFilePath)
            );
          }
          const includedFileContent = CodeFileContent.readFileSync(
            file, includeDirective.node, options,
            includedFilePath
          )
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
          catchVFileMessages(error);
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
 * - {@link remarkIncludeCodeSync}
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
