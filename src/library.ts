import type { Root, Parent } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { Data } from 'unified';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';
import iconv from 'iconv-lite';
import './types.js';

export interface DirectiveAttributes {
  file: string;
  optional: boolean;
  language: string;
  encoding: iconv.Encoding;
  trimFinalNewline: boolean;
}

export interface DirectiveInfo {
  node: LeafDirective,
  index: number,
  parent: Parent
}

/**
 * Collect `::include-code` directives for processing
 *
 * @param tree - Source AST
 * @param _file - Source markdown file
 * @returns Directives for later processing
 *
 * @internal
 */
export function getIncludeDirectives(
  tree: Root, _file: VFile
): DirectiveInfo[] {

  const includeDirectives: DirectiveInfo[] = [];

  visit(tree, 'leafDirective',
    function (node: LeafDirective, index?: number, parent?: Parent): void {
      if (node.name === 'include-code') {
        includeDirectives.push({
          node: node,
          index: index!,
          parent: parent!
        });
      }
    },
    true
  );

  return includeDirectives;
}

/**
 * Test `file.dirname` expected
 *
 * @param file - current markdown file
 * @throws `VFileMessage` if `file.dirname` is undefined
 *
 * @internal
 */
export function assertFileDirnameIsDefined(
  file: VFile
): asserts file is VFile & { get dirname(): string } {
  if (typeof file.dirname === 'undefined') {
    file.fail(
      '::include-code, unexpected error: "file" should be an instance of VFile with specified path'
    );
  }
}

/**
 * Test and return attributes of `::include-code` directive Node
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @throws `VFileMessage` if `file` attribute
 *  for `::include-code` directive does not exists or empty
 *
 * @internal
 */
// eslint-disable-next-line max-statements
export function getAttributes(
  file: VFile,
  node: LeafDirective,
  processorData: Data
): DirectiveAttributes {

  const attributes: DirectiveAttributes = {
    file: '',
    optional: false,
    language: '',
    encoding: 'utf8',
    'trimFinalNewline': false
  };

  if (!(
    (typeof node.attributes?.file === 'string') &&
    (node.attributes.file.length > 0)
  )) {
    file.fail(
      '::include-code, `file` attribute expected',
      node
    );
  }
  attributes.file = node.attributes.file;

  if (typeof node.attributes.optional === 'string') {
    switch (node.attributes.optional) {
      case '':
      case 'true': {
        attributes.optional = true;
        break;
      }
      case 'false': {
        break;
      }
      default: {
        file.fail(
          `::include-code, \`optional\` attribute invalid value "${node.attributes.optional}"`,
          node
        );
      }
    };
  }

  if (typeof node.attributes.language === 'string') {
    attributes.language = node.attributes.language;
  }

  if (typeof node.attributes.encoding === 'string') {
    if (!iconv.encodingExists(node.attributes.encoding)) {
      file.fail(
        `::include-code, unknown encoding "${node.attributes.encoding as string}"`,
        node
      );
    }
    attributes.encoding = node.attributes.encoding;
  }

  if (typeof node.attributes.trimFinalNewline === 'string') {
    switch (node.attributes.trimFinalNewline) {
      case '':
      case 'true': {
        attributes.trimFinalNewline = true;
        break;
      }
      case 'false': {
        break;
      }
      default: {
        file.fail(
          `::include-code, \`trimFinalNewline\` attribute invalid value "${node.attributes.trimFinalNewline}"`,
          node
        );
      }
    };
  } else {
    attributes.trimFinalNewline =
      processorData.settings?.includeCodeSettings?.trimFinalNewline ?? false;
  }

  const unexpectedAttributes = Object.keys(node.attributes)
    .filter((attribute) => !(Object.keys(attributes).includes(attribute)));
  if (unexpectedAttributes.length > 0) {
    const attributesList = unexpectedAttributes
      .map((s) => `\`${s}\``)
      .join(', ');
    file.fail(
      `::include-code, unknown attribute(s): ${attributesList}`,
      node
    );
  }

  return attributes;
}

/**
 * Test and return attributes of `::include-code` directive Node
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @param attributes - `::include-code` attributes
 * @param error - error from `readFile` or `readFileSync`
 * @throws `VFileMessage`
 *
 * @internal
 */
export function processFileError(
  file: VFile,
  node: LeafDirective,
  attributes: DirectiveAttributes,
  error: any
): void {
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    const errorMessage = `::include-code, file(s) "${attributes.file}" not found`;
    if (attributes.optional) {
      throw file.info(errorMessage, node);
    } else {
      file.fail(errorMessage, node);
    }
  } else {
    throw error;
  }
}

/**
 * Code file content processing
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @param attributes - `::include-code` attributes
 * @param content - file content
 * @throws `VFileMessage`
 *
 * @internal
 */
export function processCodeFileContent(
  file: VFile,
  node: LeafDirective,
  attributes: DirectiveAttributes,
  content: Buffer<ArrayBuffer>
): string {
  let textContent = iconv.decode(content, attributes.encoding)
    .replaceAll(/\r?\n/g, '\n');
  if (attributes.trimFinalNewline) {
    textContent = textContent.replace(/\n$/, '');
  };
  return textContent;
}
