import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import iconv, { type Encoding } from 'iconv-lite';
import type {
  Props as EditorConfigProperties
} from 'editorconfig';

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

export type Parameters = Readonly<IParameters> | undefined;

/**
 * Directive attributes
 */
export interface IAttributes extends Required<IParameters> {

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
 * Directive options
 */
export interface IOptions extends Required<IParameters>, IAttributes { }

type OptionsWithType<T> = {
  [K in keyof IOptions]-?: IOptions[K] extends T ? T : never
}
type OptionIDWithType<T> = keyof OptionsWithType<T>

type RequiredIf<T, Expected extends boolean> =
  Expected extends true ? T : T | undefined

abstract class OptionsBase<IParameters extends object> {

  protected readonly _file: VFile;
  protected readonly _node: LeafDirective;
  protected readonly _parameters?: IParameters;
  protected readonly _messagesScope: string;

  public constructor(
    file: VFile,
    node: LeafDirective,
    messagesScope: string,
    parameters?: IParameters,
  ) {
    this._file = file;
    this._node = node;
    this._parameters = parameters;
    this._messagesScope = messagesScope;
  }

  protected fail(message: string): never {
    this._file.fail(
      `${this._messagesScope}, ${message}`,
      this._node
    );
  }

  protected keyofAttributes(): string[] {
    return Object.keys(this);
  }

  protected abstract keyofParameters(): string[]

  public isParameter(id: string): id is Extract<keyof IParameters, string> {
    return this.keyofParameters().includes(id);
  }

  protected parseString<Expected extends boolean>(
    optionName: OptionIDWithType<string>,
    expected: Expected = false as Expected
  ): RequiredIf<string, Expected> {
    type Result = RequiredIf<string, Expected>;
    if (
      (typeof this._node.attributes?.[optionName] === 'string') &&
      (this._node.attributes[optionName].length > 0)
    ) {
      return this._node.attributes[optionName];
    } else if (this.isParameter(optionName)) {
      const parameter = this._parameters?.[optionName];
      if (parameter !== undefined) {
        return parameter as Result;
      }
    }
    if (expected) {
      this.fail(`\`${optionName}\` attribute expected`);
    }
    return undefined as Result;
  }

  protected parseBoolean<Expected extends boolean>(
    optionName: OptionIDWithType<boolean>,
    expected: Expected = false as Expected
  ): RequiredIf<boolean, Expected> {
    type Result = RequiredIf<boolean, Expected>;
    if (typeof this._node.attributes?.[optionName] === 'string') {
      switch (this._node.attributes[optionName]) {
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
          this.fail(`\`${optionName}\` attribute invalid value "${this._node.attributes[optionName]}"`);
        }
      };
    } else if (this.isParameter(optionName)) {
      const parameter = this._parameters?.[optionName];
      if (parameter !== undefined) {
        return parameter as Result;
      }
    }
    if (expected) {
      this.fail(`\`${optionName}\` attribute expected`);
    }
    return undefined as Result;
  }

  protected parseEncoding<Expected extends boolean>(
    optionName: OptionIDWithType<Encoding>,
    expected: Expected = false as Expected
  ): RequiredIf<Encoding, Expected> {
    type Result = RequiredIf<Encoding, Expected>;
    const encoding = this.parseString(optionName);
    if (encoding !== undefined) {
      if (!iconv.encodingExists(encoding)) {
        this.fail(`unknown encoding "${encoding as string}"`);
      }
      return encoding;
    } else if (this.isParameter(optionName)) {
      const parameter = this._parameters?.[optionName];
      if (parameter !== undefined) {
        return parameter as Result;
      }
    }
    if (expected) {
      this.fail(`\`${optionName}\` attribute expected`);
    }
    return undefined as Result;
  }

  protected parseInteger<Expected extends boolean>(
    optionName: OptionIDWithType<number>,
    expected: Expected = false as Expected
  ): RequiredIf<number, Expected> {
    type Result = RequiredIf<number, Expected>;
    if (typeof this._node.attributes?.[optionName] === 'string') {
      if (!Number.isInteger(Number(this._node.attributes[optionName]))) {
        this.fail(`\`${optionName}\` attribute invalid value "${this._node.attributes[optionName]}"`);
      }
      return Number(this._node.attributes[optionName]);
    } else if (this.isParameter(optionName)) {
      const parameter = this._parameters?.[optionName];
      if (parameter !== undefined) {
        return parameter as Result;
      }
    }
    if (expected) {
      this.fail(`\`${optionName}\` attribute expected`);
    }
    return undefined as Result;
  }

  protected assertNoUnknownAttributes(): void {
    if (
      (this._node.attributes !== undefined) &&
      (this._node.attributes !== null)
    ) {
      const knownAttributes = this.keyofAttributes();
      const unexpectedAttributes = Object.keys(this._node.attributes)
        .filter((attribute) => !(knownAttributes.includes(attribute)));
      if (unexpectedAttributes.length > 0) {
        const attributesList = unexpectedAttributes
          .map((s) => `\`${s}\``)
          .join(', ');
        this.fail(`unknown attribute(s): ${attributesList}`);
      }
    }
  }

}

/**
 * Directive options (attributes and parameters)
 *
 * @internal
 */
export class Options extends OptionsBase<IParameters> implements IOptions {

  public readonly file: string;
  public useEditorConfig: boolean;
  public readonly optional: boolean;
  public readonly language: string;
  public encoding: Encoding;
  public readonly trimFinalNewline: boolean;
  public trimExtraIndent: boolean;
  public readonly fromLine?: number;
  public readonly toLine?: number;
  public tabWidth?: number;

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
    file: VFile,
    node: LeafDirective,
    messagesScope: string,
    parameters?: Parameters,
  ) {
    super(file, node, messagesScope, parameters);

    this.file = this.parseString('file', true);
    this.optional = this.parseBoolean('optional') ?? false;
    this.language = this.parseString('language') ?? '';
    this.encoding = this.parseEncoding('encoding') ?? 'utf8';
    this.trimFinalNewline = this.parseBoolean('trimFinalNewline') ?? false;
    this.trimExtraIndent = this.parseBoolean('trimExtraIndent') ?? false;
    this.useEditorConfig = this.parseBoolean('useEditorConfig') ?? false;
    this.fromLine = this.parseInteger('fromLine');
    this.toLine = this.parseInteger('toLine');
    this.tabWidth = this.parseInteger('tabWidth');

    this.assertNoUnknownAttributes();
  }

  override keyofParameters(): string[] {
    const _parameters: Required<IParameters> = {
      useEditorConfig: false,
      trimFinalNewline: false,
      optional: false,
      trimExtraIndent: false
    };
    return Object.keys(_parameters);
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
