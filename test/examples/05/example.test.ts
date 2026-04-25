import { describe, it, type TestContext } from 'node:test';
import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';
import {
  remarkDirectiveUsingExample as remarkDirectiveUsingExampleWithSettings
} from './example-with-settings.ts';

await describe('remark-include-code', async () => {

  await it('trim final newline with `trim-final-newline` attribute',
    async (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveUsingExample(
          path.resolve(
            import.meta.dirname, 'fixtures',
            'main.md'
          )
        );

        t.assert.fileSnapshot(
          String(outputFile.value),
          path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
          { serializers: [(data: string) => data] }
        );
      } finally {
        process.chdir(_cwd);
      };
    }
  );

  await it('trim final newline with `trim-final-newline` setting',
    async (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveUsingExampleWithSettings(
          path.resolve(
            import.meta.dirname, 'fixtures',
            'main-without-attribute.md'
          )
        );

        t.assert.fileSnapshot(
          String(outputFile.value),
          path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
          { serializers: [(data: string) => data] }
        );
      } finally {
        process.chdir(_cwd);
      };
    }
  );

});
