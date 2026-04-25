import { remark } from 'remark';
import * as vFile from 'to-vfile';
import { remarkIncludeCodePresetSync } from '@it-service-npm/remark-include-code';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkIncludeCodePresetSync)
    .process(await vFile.read(filePath));
};
