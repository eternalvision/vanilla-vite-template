declare module 'virtual:app-meta' {
  /** Project identity injected at build time from package.json. */
  export const APP_META: {
    name: string;
    description: string;
    author: string;
    /** Browsable repository URL, or an empty string when package.json has none. */
    repositoryUrl: string;
    license: string;
  };
}
