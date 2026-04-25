import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Transformer, Preset, Processor } from 'unified';
import type { Root, Code } from 'mdast';
import remarkDirective from 'remark-directive';
import type { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';
import {
  getIncludeDirectives, getAttributes,
  assertFileDirnameIsDefined,
  processFileError, processCodeFileContent
} from './library.js';
import './types.js';

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
export function remarkIncludeCode(
  this: Processor
): Transformer<Root> {

  const processor: Processor = this;

  return function (tree: Root, file: VFile): Root {
    const includeDirectives = getIncludeDirectives(tree, file);
    assertFileDirnameIsDefined(file);
    const fileDirname = path.resolve(file.dirname);
    for (const includeDirective of includeDirectives) {
      let includedContent: Code[] = [];
      try {
        const attributes = getAttributes(
          file, includeDirective.node, processor.data()
        );
        const includedFilePath = path.resolve(fileDirname, attributes.file);
        let includedFileContent = '';
        try {
          const buffer = readFileSync(includedFilePath);
          includedFileContent = processCodeFileContent(
            file, includeDirective.node, attributes, buffer
          );
        } catch (error) {
          processFileError(file, includeDirective.node, attributes, error);
        };
        includedContent = [{
          type: 'code',
          lang: attributes.language,
          value: includedFileContent
        }];
      } catch (error) {
        if (!((error instanceof VFileMessage) && (!error.fatal))) {
          throw error;
        }
      }
      includeDirective.parent.children.splice(
        includeDirective.index, 1,
        ...includedContent
      );
    }
    return tree;
  };
}

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
    remarkIncludeCode
  ],
  settings: {
    includeCodeSettings: {
      trimFinalNewline: true
    }
  }
};
