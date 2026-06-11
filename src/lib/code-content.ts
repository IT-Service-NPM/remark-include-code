import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import iconv from 'iconv-lite';
import type { IAttributes } from './options.js';

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
  protected readonly attributes: IAttributes;
  protected fileContent?: Buffer<ArrayBuffer>;
  protected _content: string;

  public constructor(
    file: VFile,
    node: LeafDirective,
    attributes: IAttributes,
    content?: Buffer<ArrayBuffer>
  ) {
    this.file = file;
    this.node = node;
    this.attributes = attributes;
    this.fileContent = content;
    this._content = '';
  }

  public static readFileSync(
    file: VFile,
    node: LeafDirective,
    attributes: IAttributes,
    path: string
  ): CodeFileContent {
    const self = new CodeFileContent(file, node, attributes);
    try {
      self.fileContent = readFileSync(path);
    } catch (error) {
      self.catchFileError(error);
    }
    return self;
  }

  public static async readFile(
    file: VFile,
    node: LeafDirective,
    attributes: IAttributes,
    path: string
  ): Promise<CodeFileContent> {
    const self = new CodeFileContent(file, node, attributes);
    try {
      self.fileContent = await readFile(path);
    } catch (error) {
      self.catchFileError(error);
    }
    return self;
  }

  public get content(): string {
    return this._content;
  }

  public toString(): string {
    return this.content;
  }

  public decode(): this {
    this._content = this.fileContent ?
      iconv.decode(this.fileContent, this.attributes.encoding) : '';
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
          new RegExp(`^ {${extraIndentWidth.toString()}}`, 'gm'),
          ''
        );
      }
    }
    return this;
  }

  protected catchFileError(error: unknown): void {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      const errorMessage = `::include-code, file(s) "${this.attributes.file}" not found`;
      if (this.attributes.optional) {
        throw this.file.info(errorMessage, this.node);
      } else {
        this.file.fail(errorMessage, this.node);
      }
    } else {
      throw error;
    }
  }

}
