import { describe, it, type TestContext } from 'node:test';
import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';
import {
  remarkDirectiveUsingExample as remarkDirectiveSyncUsingExample
} from './example.sync.ts';
import {
  remarkDirectiveUsingExample as remarkDirectiveWithParametersUsingExample
} from './example-with-editorconfig.ts';

await describe('remark-include-code/async', async () => {

  await it('support `tabWidth` attribute',
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

  await it('replace tab with `indent_size` spaces with `useEditorConfig` attribute',
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

  await it('replace tab with `indent_size` spaces with `useEditorConfig` parameter',
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

await describe('remark-include-code/sync', async () => {

  await it('replace tab with `indent_size` spaces with `useEditorConfig` attribute',
    (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = remarkDirectiveSyncUsingExample(
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

});
