import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: {
        dark: 'github-dark-dimmed',
        light: 'github-light',
      },
      keepBackground: false,
      defaultLang: 'plaintext',
      onVisitLine(node: any) {
        // Prevent lines with no content from collapsing
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }]
        }
      },
      onVisitHighlightedLine(node: any) {
        node.properties.className = ['line', 'highlighted']
      },
      onVisitHighlightedChars(node: any) {
        node.properties.className = ['word', 'highlighted']
      },
      transformers: [
        {
          name: 'add-language-label',
          pre(node) {
            const lang = this.options.lang || 'plaintext'
            if (lang && lang !== 'plaintext') {
              node.properties['data-language'] = lang
            }
          }
        }
      ]
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(file)
}