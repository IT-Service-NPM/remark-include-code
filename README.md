# @it-service-npm/remark-include-code Remark plugin

[![GitHub release][github-release]][github-release-url]
[![NPM release][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]

[![CI Status][build]][build-url]
[![Tests Results][tests]][tests-url]
[![Coverage status][coverage]][coverage-url]

[![Semantic Versioning](https://img.shields.io/badge/Semantic%20Versioning-v2.0.0-green.svg?logo=semver)](https://semver.org/lang/ru/spec/v2.0.0.html)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-v1.0.0-yellow.svg?logo=git)](https://conventionalcommits.org)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

[![VS Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?logo=visual%20studio%20code)](https://code.visualstudio.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-333333.svg?logo=typescript)](http://www.typescriptlang.org/)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333.svg?logo=editorconfig)](https://editorconfig.org)
[![ESLint](https://img.shields.io/badge/ESLint-3A33D1?logo=eslint)](https://eslint.org)

[github-release]: https://img.shields.io/github/v/release/IT-Service-NPM/remark-include-code.svg?sort=semver&logo=github

[github-release-url]: https://github.com/IT-Service-NPM/remark-include-code/releases

[npm]: https://img.shields.io/npm/v/@it-service-npm/remark-include-code.svg?logo=npm

[npm-url]: https://www.npmjs.com/package/@it-service-npm/remark-include-code

[node]: https://img.shields.io/node/v/@it-service-npm/remark-include-code.svg

[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@it-service-npm/remark-include-code

[deps-url]: https://libraries.io/npm/@it-service-npm%2Fremark-include-code

[size]: https://packagephobia.com/badge?p=@it-service-npm/remark-include-code

[size-url]: https://packagephobia.com/result?p=@it-service-npm/remark-include-code

[build]: https://github.com/IT-Service-NPM/remark-include-code/actions/workflows/ci.yml/badge.svg?branch=main

[build-url]: https://github.com/IT-Service-NPM/remark-include-code/actions/workflows/ci.yml

[tests]: https://img.shields.io/endpoint?logo=node.js&url=https%3A%2F%2Fgist.githubusercontent.com%2Fsergey-s-betke%2Fd70e4de09a490afc9fb7a737363b231a%2Fraw%2Fremark-include-code-junit-tests.json

[tests-url]: https://github.com/IT-Service-NPM/remark-include-code/actions/workflows/ci.yml

[coverage]: https://coveralls.io/repos/github/IT-Service-NPM/remark-include-code/badge.svg?branch=main

[coverage-url]: https://coveralls.io/github/IT-Service-NPM/remark-include-code?branch=main

The `@it-service-npm/remark-include-code` package allows you
to embed code files within your Markdown documents.

With this plugin, you can use `::include-code{file="./included.ts"}`
syntax to include code to markdown.

There are two plugins: `remarkIncludeCode` (preferred) and `remarkIncludeCodeSync`.

> [!TIP]
> This plugin has two named entry points:
>
> - ‘sync’ ('@it-service-npm/remark-include-code/sync’)
> - ‘async’ ('@it-service-npm/remark-include-code/async’)
>
> With sync and async plugin function and preset.

> [!IMPORTANT]
> [`remark-directive`][] plugin expected before
> `@it-service-npm/remark-include-code`.
>
> This package provides two plugins presets:
>
> - `remarkIncludeCodePreset`. This preset contains:
>
>   - `remarkIncludeCode`
>   - `remarkDirective`
> - `remarkIncludePresetSync`. This preset contains:
>
>   - `remarkIncludeCodeSync`
>   - `remarkDirective`

[`remark-directive`]: https://www.npmjs.com/package/remark-directive

## Contents

- [Install](#install)
- [Examples](#examples)
  - [Including the content of code files](#including-the-content-of-codefiles)
- [API](#api)
- [License](#license)

## Install

```sh
npm install --save-dev @it-service-npm/remark-include-code
```

## Examples

### Including the content of code files

The `@it-service-npm/remark-include-code` package allows you
to embed code files within your Markdown documents.

Async plugin using example:

```
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import { remarkIncludeCodePreset } from '@it-service-npm/remark-include-code/async';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkIncludeCodePreset)
    .process(await vFile.read(filePath));
};

```

Source files:

main.md:

```
Hello. I am an main markdown file with `::include-code` directives.

::include-code{file=./included1.ts}

After first file.

::include-code{file="./included 2.ts"}

After second file.

_That_ should do it!

```

included1.ts:

```
export function functionInIncluded1File(): void {
  console.info('file #1');
};

```

included 2.ts:

```
export function functionInIncluded2File(): void {
  console.info('file #2');
};

```

Remark output:

````
Hello. I am an main markdown file with `::include-code` directives.

```
export function functionInIncluded1File(): void {
  console.info('file #1');
};

```

After first file.

```
export function functionInIncluded2File(): void {
  console.info('file #2');
};

```

After second file.

*That* should do it!

````

## API

Please, read the [API reference](/docs/index.md).

## License

[MIT](LICENSE) © [Sergei S. Betke](https://github.com/sergey-s-betke)
