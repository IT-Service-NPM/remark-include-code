import type { VFile } from 'vfile';
import type { Directives } from 'mdast-util-directive';
import * as OptionTypes from './option-types.ts';
import { EncodingOption } from './option-encoding.ts';
import { Options as _Options } from './options-types.ts';
import type { Encoding } from 'iconv-lite';
import type {
  Props as EditorConfigProperties
} from 'editorconfig';

/**
* Plugin parameters
*
* @public
*/
export interface IParameters {

  /**
   * use .editorconfig file if attribute value is not provided:
   *
   * - `charset` (if `encoding` attribute is not provided)
   *
   * - `indent_size` (if `tabSize` attribute is not provided)
   */
  readonly useEditorConfig?: boolean;

  /**
   * Trim final newline in code
   */
  readonly trimFinalNewline?: boolean;

  /**
   * Fail if file not found (false) or not (true)
   */
  readonly optional?: boolean;

  /**
   * Remove the general extra indentation for a block of code
   */
  readonly trimExtraIndent?: boolean;

}

/**
 * Directive attributes
 */
export interface IAttributes extends IParameters {

  /**
   * Code file path
   */
  readonly file: string;

  /**
   * Code language
   */
  readonly language: string;

  /**
   * Code file encoding
   */
  encoding: Encoding;

  /**
   * Tab width for replacing by spaces in included code
   */
  tabWidth?: number;

  /**
   * First line of included range
   */
  readonly fromLine?: number;

  /**
   * Last line of included range
   */
  readonly toLine?: number;

}

/**
 * Directive options (attributes and parameters)
 *
 * @internal
 */
export class Options extends _Options<IParameters> implements IAttributes {

  public readonly file;
  public readonly useEditorConfig;
  public readonly optional;
  public readonly language;
  public encoding;
  public readonly trimFinalNewline;
  public readonly trimExtraIndent;
  public readonly fromLine;
  public readonly toLine;
  public tabWidth;

  /**
   * Test and return options
   * (attributes and parameters)
   * of `::include-code` directive Node
   *
   * @param file - Current markdown file
   * @param node - `::include-code` directive Node
   * @param parameters - plugin parameters
   * @throws `VFileMessage` if `file` attribute
   *  for `::include-code` directive does not exists or empty
   *
   * @internal
   */
  public constructor(
    vFile: VFile,
    node: Directives,
    messagesScope: string,
    parameters?: IParameters
  ) {
    super(vFile, node, messagesScope, parameters);

    const a = this._node.attributes;
    const p = this._parameters;
    this.file = new OptionTypes.String(this, 'file', true, a).value;
    this.optional = new OptionTypes.Boolean(this, 'optional', false, a, p, false).value;
    this.language = new OptionTypes.String(this, 'language', false, a, undefined, '').value;
    this.encoding = new EncodingOption(this, 'encoding', false, a, undefined, 'utf8').value;
    this.trimFinalNewline = new OptionTypes.Boolean(this, 'trimFinalNewline', false, a, p, false).value;
    this.trimExtraIndent = new OptionTypes.Boolean(this, 'trimExtraIndent', false, a, p, false).value;
    this.useEditorConfig = new OptionTypes.Boolean(this, 'useEditorConfig', false, a, p, false).value;
    this.fromLine = new OptionTypes.Integer(this, 'fromLine', false, a).value;
    this.toLine = new OptionTypes.Integer(this, 'toLine', false, a).value;
    this.tabWidth = new OptionTypes.Integer(this, 'tabWidth', false, a).value;

    this.assertNoUnknownAttributes();
  }

  protected keyofAttributes(): string[] {
    return Object.keys(this);
  }

  /**
   * Update options of `::include-code`
   * with .editorconfig properties for code file
   *
   * @param editorconfigProperties - properties from .editorconfig for code file
   *
   * @internal
   */
  set editorConfig(
    editorconfigProperties: EditorConfigProperties
  ) {
    if (
      (this._node.attributes?.encoding === undefined) &&
      (editorconfigProperties.charset !== undefined)
    ) {
      this.encoding = editorconfigProperties.charset.toString();
    }

    if (
      (this._node.attributes?.tabWidth === undefined) &&
      (editorconfigProperties.tab_width !== undefined)
    ) {
      this.tabWidth = Number(editorconfigProperties.tab_width);
    }
  }

}
