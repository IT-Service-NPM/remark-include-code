import type { Root, Parent } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';
import { visit } from 'unist-util-visit';

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
 * Catch non fatal VFileMessage
 *
 * @internal
 */
export function assertErrorIsVFileMessage(
  error: any
): asserts error is VFileMessage & { fatal: false } {
  if (!((error instanceof VFileMessage) && (!error.fatal))) {
    throw error;
  }
}
