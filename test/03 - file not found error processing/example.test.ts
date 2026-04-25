import { describe, it, beforeEach, type TestContext } from 'node:test';
import path from 'node:path';
import { remark } from 'remark';
import type { Processor } from 'unified';
import type { Root } from 'mdast';
import * as vFile from 'to-vfile';
import {
  remarkIncludeCodePreset,
  remarkIncludeCodePresetSync
} from '@it-service-npm/remark-include-code';

await describe('remarkIncludeCodeSync', async () => {

  let RemarkProcessor: Processor<Root, undefined, undefined, Root, string>;

  beforeEach(() => {
    RemarkProcessor = remark()
      .use(remarkIncludeCodePresetSync)
      .freeze();
  });

  await it('send a INFO message to the remark processor if the file is not found and an optional attribute is present',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main-with-optional-include.md'
        )
      );
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      const outputFile = RemarkProcessor
        .processSync(testFile);

      t.assert.fileSnapshot(
        String(outputFile.value),
        path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
        { serializers: [(data: string) => data] }
      );
      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 1);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 0);
    }
  );

  await it('send a FAIL message to the remark processor if the file is not found and an optional attribute is not present',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main-with-expected-include.md'
        )
      );
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      t.assert.throws(() => {
        return RemarkProcessor
          .processSync(testFile);
      });

      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 0);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 1);
    }
  );

});

await describe('remarkIncludeCode', async () => {

  let RemarkProcessor: Processor<Root, undefined, undefined, Root, string>;

  beforeEach(() => {
    RemarkProcessor = remark()
      .use(remarkIncludeCodePreset)
      .freeze();
  });

  await it('send a INFO message to the remark processor if the file is not found and an optional attribute is present',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main-with-optional-include.md'
        )
      );
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      const outputFile = await RemarkProcessor
        .process(testFile);

      t.assert.fileSnapshot(
        String(outputFile.value),
        path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
        { serializers: [(data: string) => data] }
      );
      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 1);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 0);
    }
  );

  await it('send a FAIL message to the remark processor if the file is not found and an optional attribute is not present',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main-with-expected-include.md'
        )
      );
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      await t.assert.rejects(
        RemarkProcessor
          .process(testFile)
      );

      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 0);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 1);
    }
  );

});
