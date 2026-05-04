import type { Directives } from 'mdast-util-directive';

export type IAttributes = Directives['attributes']

export type IParameters<Name extends string, T> = {
  readonly [Parameter in Name]?: T
}

export interface IMessenger {

  fail(message: string): never

}

type RequiredIf<T, Expected extends boolean> =
  Expected extends true ? T : T | undefined

type Value<T, Expected extends boolean, TDefault extends T | undefined> =
  TDefault extends T ? T : RequiredIf<T, Expected>

export interface IOption<T, IsRequired extends boolean> {
  valueOf(): RequiredIf<T, IsRequired>
}

export abstract class Option<
  Name extends string,
  T,
  IsRequired extends boolean,
  TDefault extends T | undefined
> implements IOption<T, IsRequired> {

  protected readonly _name: string;
  protected readonly _messenger: IMessenger;
  protected _value: Value<T, IsRequired, TDefault>;

  public constructor(
    messenger: IMessenger,
    name: Name,
    required: IsRequired = false as IsRequired,
    attributes: IAttributes,
    parameters?: IParameters<Name, T>,
    defaultValue?: TDefault
  ) {
    this._name = name;
    this._messenger = messenger;

    const __value: T | undefined =
      this.parse(attributes?.[name]) ??
      parameters?.[name] ??
      defaultValue;
    if (required) {
      this.assertValueDefined(__value);
    }
    this._value = __value as Value<T, IsRequired, TDefault>;
  }

  public valueOf(): RequiredIf<T, IsRequired> {
    return this.value;
  }

  public get value() {
    return this._value;
  }

  public set value(value: Value<T, IsRequired, TDefault>) {
    this._value = value;
  }

  protected abstract parse(
    value: string | null | undefined
  ): T | undefined

  protected assert(
    condition: boolean,
    message: string
  ): asserts condition is true {
    if (!condition) {
      this._messenger.fail(message);
    }
  }

  protected assertValueDefined(
    value: T | undefined
  ): asserts value is T {
    this.assert(
      value !== undefined,
      `option \`${this._name}\` value expected`
    );
  }

  protected assertValueIsValid(
    condition: boolean,
    value: string
  ): asserts condition is true {
    this.assert(
      condition,
      `\`${this._name}\` option invalid value "${value}"`
    );
  }

}

export class String<
  Name extends string,
  IsRequired extends boolean,
  TDefault extends string | undefined
> extends Option<Name, string, IsRequired, TDefault> {

  protected parse(
    value: string | null | undefined
  ): string | undefined {
    if (
      (typeof value === 'string') &&
      (value.length > 0)
    ) {
      return value;
    }
  }
}

export class Boolean<
  Name extends string,
  IsRequired extends boolean,
  TDefault extends boolean | undefined
> extends Option<Name, boolean, IsRequired, TDefault> {

  protected parse(
    value: string | null | undefined
  ): boolean | undefined {
    if (typeof value === 'string') {
      switch (value) {
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
          this.assertValueIsValid(false, value);
        }
      };
    }
  }
}

export class Integer<
  Name extends string,
  IsRequired extends boolean,
  TDefault extends number | undefined
> extends Option<Name, number, IsRequired, TDefault> {

  protected parse(
    value: string | null | undefined
  ): number | undefined {
    if (typeof value === 'string') {
      const _value = Number.parseInt(value);
      this.assertValueIsValid(Number.isInteger(_value), value);
      return _value;
    }
  }
}
