import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkIncludeCode } from '@it-service-npm/remark-include-code/sync';
import type { VFile } from 'vfile';

export function remarkDirectiveUsingExample(
  filePath: string
): VFile {
  return remark()
    .use(remarkDirective)
    .use(remarkIncludeCode)
    .processSync(vFile.readSync(filePath));
};
