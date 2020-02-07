module.exports = {
  title: "Hello World",
  description: "An experiment.",
  markdown: {
    linkify: true,
    extendMarkdown: md => {
      /**
       * 
       * Replacing at the markdown processing level
       * 
       * CAVEAT:
       * this doesn't work because `extendMarkdown` has absolutely
       * no access to page data, route data, nothing. there is
       * no way for me to reference anything on the page
       * to use as a string replacement.
       */
          
      const mdForInline = require("markdown-it-for-inline");

      // this is a test variable. the goal is to have it 
      // be dynamic to the version folder
      const latestVer = "0.3.2";

      const semverStr = "semver";
      const latestVerRegEx = new RegExp(`(${semverStr}).*?`, "gm");

      if (latestVer && latestVer.length > 0) {
        // replace semver in text strings
        md.use(mdForInline, "semver_text_replace", "text", (tokens, idx) => {
          tokens[idx].content = tokens[idx].content.replace(latestVerRegEx, latestVer);
        });

        // replace semver in url hrefs
        md.use(mdForInline, "semver_uri_replace", "link_open", (tokens, idx) => {
          tokens[idx].attrs.forEach(i => {
            if (i[0] === "href") {
              i[1] = i[1].replace(latestVerRegEx, latestVer);
            }
          });
        });
      }
    }
  },
  configureWebpack: (config, isServer) => {
    /**
     * 
     * Replacing at the webpack processing level
     * 
     * CAVEAT:
     * this doesn't work because it has no access
     * to the folder name to derive a version
     * number from, which means we can't access
     * a `config.js` file, for example, either.
     */

    // return {
    //   module: {
    //     rules: [
    //       {
    //         test: /\.md$/,
    //         loader: 'string-replace-loader',
    //         options: {
    //           search: '(semver).*?',
    //           replace: '1.2.3',
    //           flags: 'gm'
    //         }
    //       }
    //     ]
    //   }
    // }
  }
};
