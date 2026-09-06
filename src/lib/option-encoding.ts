import { Option } from './option-types.ts';
import { type Encoding, encodingExists } from 'iconv-lite';

export class EncodingOption<
  Name extends string,
  IsRequired extends boolean,
  TDefault extends Encoding | undefined
> extends Option<Name, Encoding, IsRequired, TDefault> {

  protected parse(
    value: string | null | undefined
  ): Encoding | undefined {
    if (typeof value !== 'string') {
      return;
    }
    this.assertValueIsValid(encodingExists(value), value);
    return value;
  }
}
