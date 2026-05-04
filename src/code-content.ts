import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import iconv from 'iconv-lite';
import type { IDirectiveAttributes, Parameters } from './options.js';

/**
 * Class for code file content
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @param attributes - `::include-code` attributes
 * @param content - file content
 *
 * @internal
 */
export class CodeFileContent {

  protected readonly file: VFile;
  protected readonly node: LeafDirective;
  protected readonly attributes: IDirectiveAttributes;
  protected readonly fileContent: Buffer<ArrayBuffer>;
  protected _content: string;

  public constructor(
    file: VFile,
    node: LeafDirective,
    attributes: IDirectiveAttributes,
    content: Buffer<ArrayBuffer>
  ) {
    this.file = file;
    this.node = node;
    this.attributes = attributes;
    this.fileContent = content;
    this._content = '';
  }

  public get content(): string {
    return this._content;
  }

  public toString(): string {
    return this.content;
  }

  public decode(): this {
    this._content = iconv.decode(this.fileContent, this.attributes.encoding);
    return this;
  }

  public normalizeEOL(): this {
    this._content = this._content.replaceAll(/\r?\n/g, '\n');
    return this;
  }

  public trimFinalNewline(): this {
    if (this.attributes.trimFinalNewline) {
      this._content = this._content.replace(/\n$/, '');
    }
    return this;
  }

  public selectLinesRange(): this {
    const contentLines = this._content.split('\n');
    this._content = contentLines
      .slice(
        (this.attributes.fromLine ?? 1) - 1,
        this.attributes.toLine ?? contentLines.length
      )
      .join('\n');
    return this;
  }

  public replaceTabs(): this {
    if (this.attributes.tabWidth !== undefined) {
      const w = this.attributes.tabWidth;
      this._content = this._content.replaceAll(
        new RegExp(
          String.raw`(?<=^( {${w.toString()}}| {0,${(w - 1).toString()}}\t)*) {0,${(w - 1).toString()}}\t`,
          'gm'
        ),
        ' '.repeat(w)
      );
    }
    return this;
  }

  public normalizeIndent(): this {
    if (
      this.attributes.trimExtraIndent &&
      (this.attributes.tabWidth !== undefined)
    ) {
      // eslint-disable-next-line sonarjs/slow-regex
      const indentsWidth = /^\s*(?=\S)/gmd
        .exec(this._content)
        ?.indices
        ?.map(
          (
            indentPosition?: [number, number]
          ): number =>
            indentPosition ? indentPosition[1] - indentPosition[0] : 0
        );
      const extraIndentWidth = indentsWidth ?
        // eslint-disable-next-line unicorn/no-null
        Math.min.apply(null, indentsWidth) : 0;
      if (extraIndentWidth) {
        this._content = this._content.replaceAll(
          new RegExp(String.raw`^ {${extraIndentWidth.toString()}}`, 'gm'),
          ''
        );
      }
    }
    return this;
  }

}

/**
 * Code file content processing
 *
 * @param file - Current markdown file
 * @param node - `::include-code` directive Node
 * @param attributes - `::include-code` attributes
 * @param parameters - plugin parameters
 * @param content - file content
 * @throws `VFileMessage`
 *
 * @internal
 */
export function processCodeFileContent(
  file: VFile,
  node: LeafDirective,
  attributes: IDirectiveAttributes,
  parameters: Parameters | undefined,
  content: Buffer<ArrayBuffer>
): string {

  let textContent = iconv.decode(content, attributes.encoding)
    // EOL normalize
    .replaceAll(/\r?\n/g, '\n');

  if (attributes.trimFinalNewline) {
    textContent = textContent.replace(/\n$/, '');
  }

  // select range of code lines
  const contentLines = textContent.split('\n');
  textContent = contentLines
    .slice(
      (attributes.fromLine ?? 1) - 1,
      attributes.toLine ?? contentLines.length
    )
    .join('\n');

  // replace tabs with spaces
  if (attributes.tabWidth !== undefined) {
    textContent = textContent.replaceAll(
      new RegExp(
        String.raw`(?<=^( {${attributes.tabWidth.toString()}}| {0,${(attributes.tabWidth - 1).toString()}}\t)*) {0,${(attributes.tabWidth - 1).toString()}}\t`,
        'gm'
      ),
      ' '.repeat(attributes.tabWidth)
    );
  }

  if (
    attributes.trimExtraIndent &&
    (attributes.tabWidth !== undefined)
  ) {
    // eslint-disable-next-line sonarjs/slow-regex
    const indentsWidth = /^\s*(?=\S)/gmd
      .exec(textContent)
      ?.indices
      ?.map(
        (
          indentPosition?: [number, number]
        ): number => indentPosition ? indentPosition[1] - indentPosition[0] : 0
      );
    const extraIndentWidth = indentsWidth ?
      // eslint-disable-next-line unicorn/no-null
      Math.min.apply(null, indentsWidth) : 0;
    if (extraIndentWidth) {
      textContent = textContent.replaceAll(
        new RegExp(String.raw`^ {${extraIndentWidth.toString()}}`, 'gm'),
        ''
      );
    }
  }

  return textContent;
}
