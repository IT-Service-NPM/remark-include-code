/**
 * The `@it-service-npm/remark-include-code` package allows you
 * to embed code files within your Markdown documents.
 *
 * This plugin allows you to incorporate code into your markdown using the
 * `::include-code{file="./included.ts"}`
 * syntax.
 *
 * @packageDocumentation
 */

export {
  remarkIncludeCode as remarkIncludeCodeSync,
  remarkIncludeCodePreset as remarkIncludeCodePresetSync
} from './sync.ts';
export {
  remarkIncludeCode,
  remarkIncludeCodePreset, remarkIncludeCodePreset as default
} from './async.ts';
