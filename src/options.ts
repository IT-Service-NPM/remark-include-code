import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import iconv, { type Encoding } from 'iconv-lite';
import { type Props } from 'editorconfig';

/**
 * Plugin parameters
 */
export interface IParameters {

  /**
   * use .editorconfig file if attribute value is not provided:
   *
   * - `charset` (if `encoding` attribute is not provided)
   * - `indent_size` (if `tabSize` attribute is not provided)
   */
  useEditorConfig?: boolean;

  /**
   * Trim final newline in code
   */
  trimFinalNewline?: boolean;

  /**
   * Fail if file not found (false) or not (true)
   */
  optional?: boolean;

}

export type Parameters = Readonly<IParameters> | undefined;

/**
 * Directive attributes
 */
export interface IDirectiveAttributes extends Required<IParameters> {

  /**
   * Code file path
   */
  file: string;

  /**
   * Code language
   */
  language: string;

  /**
   * Code file encoding
   */
  encoding: iconv.Encoding;

  /**
   * Tab width for replacing by spaces in included code
   */
  tabWidth?: number;

  /**
   * First line of included range
   */
  fromLine?: number;

  /**
   * Last line of included range
   */
  toLine?: number;

}

function keyofParameters(): string[] {
  const _parameters: Required<IParameters> = {
    useEditorConfig: false,
    trimFinalNewline: false,
    optional: false
  };
  return Object.keys(_parameters);
}

function isParameter(id: string): id is keyof IParameters {
  return keyofParameters().includes(id);
}

/**
 * Test and return attributes of `::include-code` directive Node
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @param parameters - plugin parameters
 * @throws `VFileMessage` if `file` attribute
 *  for `::include-code` directive does not exists or empty
 *
 * @internal
 */
export function getAttributes(
  file: VFile,
  node: LeafDirective,
  parameters?: Parameters
): IDirectiveAttributes {

  const attributes: IDirectiveAttributes = {
    file: parseFileAttribute('file'),
    optional: parseOptionalBooleanAttribute('optional') ?? false,
    language: parseOptionalStringAttribute('language') ?? '',
    encoding: parseOptionalEncodingAttribute('encoding') ?? 'utf8',
    trimFinalNewline: parseOptionalBooleanAttribute('trimFinalNewline') ?? false,
    useEditorConfig: parseOptionalBooleanAttribute('useEditorConfig') ?? false,
    fromLine: parseOptionalIntegerAttribute('fromLine'),
    toLine: parseOptionalIntegerAttribute('toLine'),
    tabWidth: parseOptionalIntegerAttribute('tabWidth')
  };

  assertNoUnknownAttributes(node.attributes);

  return attributes;

  function assertNoUnknownAttributes(
    _attributes?: Record<string, string | null | undefined> | null
  ): asserts _attributes is Record<
    keyof IDirectiveAttributes,
    string | null | undefined
  > | null {
    if ((_attributes !== undefined) && (_attributes !== null)) {
      const knownAttributes = Object.keys(attributes);
      const unexpectedAttributes = Object.keys(_attributes)
        .filter((attribute) => !(knownAttributes.includes(attribute)));
      if (unexpectedAttributes.length > 0) {
        const attributesList = unexpectedAttributes
          .map((s) => `\`${s}\``)
          .join(', ');
        file.fail(
          `::include-code, unknown attribute(s): ${attributesList}`,
          node
        );
      }
    }
  }

  function parseFileAttribute(
    optionName: keyof IDirectiveAttributes
  ): string {
    if (!(
      (typeof node.attributes?.[optionName] === 'string') &&
      (node.attributes[optionName].length > 0)
    )) {
      file.fail(
        `::include-code, \`${optionName}\` attribute expected`,
        node
      );
    }
    return node.attributes[optionName];
  }

  function parseOptionalBooleanAttribute(
    optionName: keyof IDirectiveAttributes
  ): boolean | undefined {
    if (typeof node.attributes?.[optionName] === 'string') {
      switch (node.attributes[optionName]) {
        case '':
        case 'true': {
          return true;
          break;
        }
        case 'false': {
          return false;
          break;
        }
        default: {
          file.fail(
            `::include-code, \`${optionName}\` attribute invalid value "${node.attributes[optionName]}"`,
            node
          );
        }
      };
    } else {
      if (isParameter(optionName)) {
        return parameters?.[optionName];
      }
    }
  }

  function parseOptionalStringAttribute(
    optionName: keyof IDirectiveAttributes
  ): string | undefined {
    if (typeof node.attributes?.[optionName] === 'string') {
      return node.attributes[optionName];
    } else {
      return isParameter(optionName) ?
        parameters?.[optionName] as string | undefined :
        undefined;
    }
  }

  function parseOptionalEncodingAttribute(
    optionName: keyof IDirectiveAttributes
  ): Encoding | undefined {
    const encoding = parseOptionalStringAttribute(optionName);
    if (encoding === undefined) {
      return encoding;
    }
    if (iconv.encodingExists(encoding)) {
      return encoding;
    }
    file.fail(
      `::include-code, unknown encoding "${encoding as string}"`,
      node
    );
  }

  function parseOptionalIntegerAttribute(
    optionName: keyof IDirectiveAttributes
  ): number | undefined {
    if (typeof node.attributes?.[optionName] === 'string') {
      if (!Number.isInteger(Number(node.attributes[optionName]))) {
        file.fail(
          `::include-code, \`${optionName}\` attribute invalid value "${node.attributes[optionName]}"`,
          node
        );
      }
      return Number(node.attributes[optionName]);
    } else {
      return isParameter(optionName) ?
        parameters?.[optionName] as number | undefined :
        undefined;
    }
  }
}

/**
 * Update attributes of `::include-code`
 * with .editorconfig properties for code file
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @param parameters - plugin parameters
 * @param attributes - `::include-code` attributes
 * @param editorconfigProperties - properties from .editorconfig for code file
 * @throws `VFileMessage` if `file` attribute
 *  for `::include-code` directive does not exists or empty
 *
 * @internal
 */
export function updateAttributesWithEditorconfig(
  file: VFile,
  node: LeafDirective,
  _parameters: Parameters,
  attributes: IDirectiveAttributes,
  editorconfigProperties: Props
): IDirectiveAttributes {

  if (
    (node.attributes?.encoding === undefined) &&
    (editorconfigProperties.charset !== undefined)
  ) {
    attributes.encoding = editorconfigProperties.charset.toString();
  }

  if (
    (node.attributes?.tabWidth === undefined) &&
    (editorconfigProperties.tab_width !== undefined)
  ) {
    attributes.tabWidth = Number(editorconfigProperties.tab_width);
  }

  return attributes;
}
