import remarkDirective from 'remark-directive';
import { remarkIncludeCode } from '@it-service-npm/remark-include-code/async';

export default {
  plugins: [
    remarkDirective,
    remarkIncludeCode,
  ],
  settings: {
    bullet: '-',
    includeCodeSettings: {
      trimFinalNewline: true
    }
  }
}
