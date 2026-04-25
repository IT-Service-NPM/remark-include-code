import { describe, it, type TestContext } from 'node:test';
import { remark } from 'remark';
import { VFile } from 'vfile';
import { remarkIncludeCodePresetSync } from '@it-service-npm/remark-include-code';

await describe('remark-include-code', async () => {

  await it('send a FAIL message to the remark processor if the file does not have a path',
    async (t: TestContext) => {

      const testFile = new VFile([
        'Hello. I am an main markdown file with `::include-code` directive.',
        '',
        '::include{}',
        '',
        '_That_ should do it!'
      ].join('\n'));
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      const RemarkProcessor = remark()
        .use(remarkIncludeCodePresetSync)
        .freeze();

      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        await t.assert.rejects(
          RemarkProcessor
            .process(testFile)
        );

      } finally {
        process.chdir(_cwd);
      };

      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 0);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 1);
    }
  );

});
