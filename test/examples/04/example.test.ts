import { describe, it, type TestContext } from 'node:test';
import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';
import {
  remarkDirectiveUsingExample as remarkDirectiveWithParametersUsingExample
} from './example-with-editorconfig.ts';

await describe('remark-include-code', async () => {

  await it('support CP866 encoding with `encoding` attribute',
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

  await it('support encoding with `useEditorConfig` attribute',
    async (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveUsingExample(
          path.resolve(
            import.meta.dirname, 'fixtures',
            'main-with-editorconfig.md'
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

  await it('support encoding with `useEditorConfig` parameter',
    async (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveWithParametersUsingExample(
          path.resolve(
            import.meta.dirname, 'fixtures',
            'main-without-editorconfig.md'
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
