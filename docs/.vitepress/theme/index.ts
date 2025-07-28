import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import { theme, useOpenapi, useTheme } from 'vitepress-openapi/client';
import 'vitepress-openapi/dist/style.css';
import spec from '../../public/openapi.json' with { type: 'json' }


function jsDocLinks(md: markdownit) {
  // ---------------------------------------------------------------------------
  // Put the core rule *after* "normalize" so we get already‑normalised text
  // but *before* "block" so the block‑parser sees our replacement markdown.
  // ---------------------------------------------------------------------------
  md.core.ruler.after('normalize', 'jsdoc_links_to_md', (state) => {
      console.log(state.src);


    state.src = state.src
      // {@link https://foo.com | Foo}  or  {@link https://foo.com Foo}
      .replace(
        /(?<!\\)\{\s*@link\s+([^\s|}]+)(?:\s*[| ]\s*([^}]+))?\s*}/g,
        (_, url, label) => `[${label || url}](${url})`,
      )

      // @see https://foo.com
      .replace(/(?<!\\)@see\s+(https?:\/\/\S+)(?=[\s)]|$)/g, (_, url) => `see: [${url}](${url})`);

      console.log(state.src);
      
  });
}

export default {
  ...DefaultTheme,
  async enhanceApp({ app, router, siteData }) {
    const openapi = useOpenapi({
      spec: spec as any,
      config: {},
    });
    
    useTheme({
      jsonViewer: {
        renderer: 'shiki',
      },
      response: {
        responseCodeSelector: 'tabs',
        maxTabs: 10,
      },
    });

    theme.enhanceApp({ app, openapi });
  },
} satisfies Theme;
