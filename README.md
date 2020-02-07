# VuePress Dynamic Version Experiment

### Get started

```
yarn global add vuepress
```

```
yarn docs:dev
```

- Go to [http://localhost:8080/0.3.2/](http://localhost:8080/0.3.2/)
- Page edits are done in [docs/0.3.2/README.md](docs/0.3.2/README.md)
- `semver` is the string that gets replaced
  - The markdown replacement method is currently active but not the webpack approach
  - See [docs/.vuepress/config.js](docs/.vuepress/config.js) for relevant
    replace functions

---

## The goal
Say that we have a standard VuePress project and we want to have versioned
documentation directories for pages. We don't want to have to hard-code the
version number into the doc files and ideally would like it to be generated
when the content is compiled. This project is an experiment to try and achieve
this in an efficient (and sane) manner.

---

### Approach 1 - String replacement at the markdown processing level
When markdown compiles, a string (in our case `semver`) gets automatically
replaced with the real version number. You can see this within `extendMarkdown`
in our VuePress [config.js](docs/.vuepress/config.js) file.

*Read more about `extendMarkdown` in VuePress [here](https://vuepress.vuejs.org/config/#markdown-extendmarkdown)*

#### The problem
While this approach works perfectly, there is no way within `extendMarkdown` to
get the version number dynamically from maybe the folder path, or a frontmatter
value.

### Approach 2 - String replacement at the webpack processing level
Via the [`string-replace-loader`](https://github.com/Va1/string-replace-loader) 
module, we again look for our `semver` string so that we can dynamically replace
it upon compiling with our actual version number, which should be based on the 
version of docs the user is editing.

#### The problem
This approach also works perfectly, except we face the same issue: how do we get
the proper version string? If we could get the path of the markdown file being
processed, we could reference that as a starting point to look for a `config.js`
file within the directory, or try to find and parse a frontmatter string.

---

## The current approach - [read about it here](https://github.com/kong/kuma-website#cutting-a-new-release)
I've written a Node script for VuePress that allows a user to "cut" a new
documentation version with ease.

**Prerequisites before running the existing script:**

1. Create a new branch for your release
2. Make all of your new edits in the "DRAFT" docs folder
3. Once you are done, use the existing `kumacut` script ([reference](https://github.com/kong/kuma-website#cutting-a-new-release)) to cut your
new docs version
4. Merge when done

**Side note:** any further edits should be made in "DRAFT" and then cut your
docs version again. Editing within your already cut folder will mean that your
"DRAFT" folder will fall out of sync, which can make things unmanageable.

**Here is the command breakdown for this script:**
```
kumacut --help
Usage: kumacut [options] [command]

Options:
  -v, --version     Output the current version of this script.
  -h, --help        output usage information

Commands:
  latest            display the latest version of Kuma
  bump              this will simply cut a new patch and bump the patch number up by 1
  new <type> [ver]  options: major, minor, custom <version>, or it defaults to patch
```

1. It clones a folder titled "DRAFT" -- this is the folder where all new
documentation should derive from, thus it should always be the source of truth.
  - When the folder is cloned, it is renamed accordingly to the version specified
    when using the script (`kumacut [latest, bump, new <major|minor|custom> <custom version>]`)
2. Once the folder is cloned, a find-and-replace is done on all markdown files
present within that new version's folder. This will replace a placeholder string
with the version that was specified when running the script
3. A new sidebar navigation block will be appended to the VuePress sidebar
configuration for our new release
4. The new release version will be appended to a custom `releases.json` file that
is used across the website for various things (like a version selector in the
documentation pages sidebar, etc.)

---

#### Additional notes

> Why can't you just use relative URLs in your doc pages and not have to worry about the version number?

This would be nice and make life easier, but for SEO purposes, `/docs/0.3.2/` is
better than `/0.3.2/docs/`.

> What about replacing the version placeholder string in the browser?

This would work on the surface, but the compiled content in the HTML itself
would still reflect the `/semver/` URIs. We want to ensure that search engines
don't index inaccurate content that has placeholders, vs proper documentation
semver strings.