import type { VFile } from 'vfile';
import type { Directives } from 'mdast-util-directive';
import type {
  IMessenger
} from './option-types.js';

export abstract class Options<
  IParameters extends object | undefined = undefined
> implements IMessenger {

  protected readonly _file: VFile;
  protected readonly _node: Directives;
  protected readonly _parameters?: IParameters;
  protected readonly _messagesScope: string;

  public constructor(
    vFile: VFile,
    node: Directives,
    messagesScope: string,
    parameters?: IParameters,
  ) {
    this._file = vFile;
    this._node = node;
    this._parameters = parameters;
    this._messagesScope = messagesScope;
  }

  public fail(message: string): never {
    this._file.fail(
      `${this._messagesScope}, ${message}`,
      this._node
    );
  }

  protected assertNoUnknownAttributes(): void {
    if (!this._node.attributes) {
      return;
    }
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

  protected abstract keyofAttributes(): string[]

}
