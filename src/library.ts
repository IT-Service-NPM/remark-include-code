import type { Root, Parent } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

export interface DirectiveAttributes {
  file: string;
  optional: boolean
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
export function getAttributes(
  file: VFile,
  node: LeafDirective
): DirectiveAttributes {

  const attributes: DirectiveAttributes = {
    file: '',
    optional: false
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
