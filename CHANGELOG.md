<!-- markdownlint-configure-file
{
  'default': true,
  'line-length': false,
  'no-duplicate-heading': false,
  'no-multiple-blanks': false,
  'heading-increment': false,
  'single-title': false
}
-->
# 📓 Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.3.8](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.7...v2.3.8) (2026-06-11)

### Performance Improvements

* optimize `normalizeIndent`
  ([ef3c9b0](https://github.com/IT-Service-NPM/remark-include-code/commit/ef3c9b08f7601ee6997c892b4cbdc8d55fec5b08))

## [2.3.7](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.6...v2.3.7) (2026-06-11)

### Bug Fixes

* fix `normalizeIndent`
  ([4ffe12b](https://github.com/IT-Service-NPM/remark-include-code/commit/4ffe12b9afe49d4cc3a4a71151aa86b5cc1956f4))

## [2.3.6](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.5...v2.3.6) (2026-06-11)

### Bug Fixes

* fix TSDoc `tabWidth` refs
  ([b1ed9b3](https://github.com/IT-Service-NPM/remark-include-code/commit/b1ed9b3ff783d83821239c4bca1f8cacb90163c1))

## [2.3.5](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.4...v2.3.5) (2026-06-08)

### Bug Fixes

* fix `IParameters` TSDoc
  ([617e6f6](https://github.com/IT-Service-NPM/remark-include-code/commit/617e6f68c2ce565a174f6ef99e7c03502663f38b))

## [2.3.4](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.3...v2.3.4) (2026-06-01)

### Bug Fixes

* export `IParameters` type
  ([db1b9d3](https://github.com/IT-Service-NPM/remark-include-code/commit/db1b9d3691dc2c4ba9f4b885947f1d432c132751))

## [2.3.3](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.2...v2.3.3) (2026-05-04)

* refactor - add `catchVFileMessages`
  ([e8a636f](https://github.com/IT-Service-NPM/remark-include-code/commit/e8a636f219ea12f4fc36841062582d0dd0c11ce0))

## [2.3.2](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.3.1...v2.3.2) (2026-05-04)

* refactor `processCodeFileContent`
  (add `class CodeFileContent` for file content processing)
  ([431db58](https://github.com/IT-Service-NPM/remark-include-code/commit/431db58ec1331a600917b76fdbf6cfb2d3f9793c))

# [2.3.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.2.0...v2.3.0) (2026-05-02)

### Features

* add `trimExtraIndent` option
  ([2045f13](https://github.com/IT-Service-NPM/remark-include-code/commit/2045f13be9c69acac36ab931f0fb23bdab2a0ebf))

# [2.2.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.1.0...v2.2.0) (2026-04-28)

### Features

* replace tab by spaces (`tabWidth` attribute)
  ([c114c36](https://github.com/IT-Service-NPM/remark-include-code/commit/c114c36885008c987b709c731d5a181aa9d1cc3b))

# [2.1.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v2.0.0...v2.1.0) (2026-04-28)

### Features

* `useEditorConfig` attribute and parameter
  ([196c1e2](https://github.com/IT-Service-NPM/remark-include-code/commit/196c1e2d63990353ede3d4f215074367992eed23))

# [2.0.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v1.3.0...v2.0.0) (2026-04-28)

### BREAKING CHANGES

* remove `trimFinalNewline` setting
  and add `trimFinalNewline` plugin parameter
  ([90ba180](https://github.com/IT-Service-NPM/remark-include-code/commit/90ba18041ed597b6d8346414ebab06c478420af4))

# [1.3.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v1.2.1...v1.3.0) (2026-04-25)

### Features

* `fromLine`, `toLine` attributes support
  ([f06f58b](https://github.com/IT-Service-NPM/remark-include-code/commit/f06f58b937ddd39bee7f38920318a13e140c66be))

## [1.2.1](https://github.com/IT-Service-NPM/remark-include-code/compare/v1.2.0...v1.2.1) (2026-04-25)

### Bug Fixes

* rename `trimFinalNewline` attribute
  ([04ae754](https://github.com/IT-Service-NPM/remark-include-code/commit/04ae7547e661315bcf25254e30c5cd3c6489a4fc))

# [1.2.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v1.1.0...v1.2.0) (2026-04-25)

### Features

* add `trim-final-newline` attribute support
  ([b917291](https://github.com/IT-Service-NPM/remark-include-code/commit/b917291523082cd4f33f49bceb492d9f252de5a9))

# [1.1.0](https://github.com/IT-Service-NPM/remark-include-code/compare/v1.0.0...v1.1.0) (2026-04-25)

### Features

* convert CRLF in code files to LF
  ([6eabb47](https://github.com/IT-Service-NPM/remark-include-code/commit/6eabb47c0158d964125f37eec73cbbeafa07b69e))

* add `encoding` attribute support
  ([3316250](https://github.com/IT-Service-NPM/remark-include-code/commit/331625004f42cc27f70393adb925202c4330ddf8))

# 1.0.0 (2026-04-25)

### Features

* add `language` attribute support
  ([aace76b](https://github.com/IT-Service-NPM/remark-include-code/commit/aace76b1c88cbc7cab7c842dea66e9a0dd99ed84))
* add simple `::include-code` directive
  ([d6cc946](https://github.com/IT-Service-NPM/remark-include-code/commit/d6cc94670e04a8e7ce72badfd060fcb54a7b2163))
