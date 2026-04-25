declare module 'unified' {

  interface Settings {
    /**
     * remarkIncludeCode settings
     *
     * @public
     */
    includeCodeSettings?: {

      /**
       * Remove final newline from code if true
       *
       * @public
       */
      trimFinalNewline?: boolean
    }
  }

};
