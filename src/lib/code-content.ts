import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import iconv from 'iconv-lite';
import type { IAttributes } from './options.js';

function isEnoentError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string' &&
    (error as { code?: string }).code === 'ENOENT'
  );
}

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
  protected fileContent?: Buffer;
  protected _content: string;

  public constructor(
    file: VFile,
    node: LeafDirective,
    attributes: IAttributes,
    content?: Buffer
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
      self.handleFileError(error);
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
      self.handleFileError(error);
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

  private buildTabReplacementPattern(tabWidth: number): RegExp {
    return new RegExp(
      String.raw`(?<=^( {${tabWidth.toString()}}| {0,${(tabWidth - 1).toString()}}\t)*) {0,${(tabWidth - 1).toString()}}\t`,
      'gm'
    );
  }

  public replaceTabs(): this {
    if (this.attributes.tabWidth !== undefined) {
      this._content = this._content.replaceAll(
        this.buildTabReplacementPattern(this.attributes.tabWidth),
        // eslint-disable-next-line unicorn/no-unsafe-string-replacement
        ' '.repeat(this.attributes.tabWidth)
      );
    }
    return this;
  }

  public normalizeIndent(): this {
    if (
      this.attributes.trimExtraIndent &&
      (this.attributes.tabWidth !== undefined)
    ) {
      const indentWidths = Array.from(
        // eslint-disable-next-line sonarjs/super-linear-regex
        this._content.matchAll(/^\s*(?=\S)/gm),
        (match): number => match[0].length
      );
      const extraIndentWidth = indentWidths.length > 0 ?
        Math.min(...indentWidths) : 0;
      if (extraIndentWidth) {
        this._content = this._content.replaceAll(
          new RegExp(`^ {${extraIndentWidth.toString()}}`, 'gm'),
          ''
        );
      }
    }
    return this;
  }

  protected handleFileError(error: unknown): void {
    if (isEnoentError(error)) {
      const errorMessage = `::include-code, file "${this.attributes.file}" not found`;
      if (this.attributes.optional) {
        throw this.file.info(errorMessage, this.node);
      }
      this.file.fail(errorMessage, this.node);
    } else {
      throw error;
    }
  }

}
