const rules: Array<{ regex: RegExp, replacer: (match: string, ...args: Array<string>) => string }> = [
    // Destroy html (XSS protection)
    {
        regex: /</gm,
        replacer: () => '&gt;',
    },

    // Line breaks
    {
        regex: /^\n*/gm,
        replacer: () => '<br />',
    },

    //cleanLines
    {
        regex: /^\s*/gm,
        replacer: (): "" => '',
    },

    //headers
    {
        regex: /(#+)(.*)/gmi,
        replacer: (match: string, $1: string, $2: string): `<h${number}>${string}</h${number}>` =>
        {
            const h: number = $1.trim().length;
            return `<h${h}>${$2.trim()}</h${h}>`;
        }
    },

    //images
    {
        regex: /!\[([^[]+)\]\(([^)]+)\)/gmi,
        replacer: (match: string, $1: string, $2: string): `<img src="${string}" alt="${string}">` => `<img src="${$2}" alt="${$1}">`,
    },

    //links
    {
        regex: /\[([^[]+)\]\(([^)]+)\)/gmi,
        replacer: (match: string, $1: string, $2: string): `<a href="${string}">${string}</a>` => `<a href="${$2}">${$1}</a>`,
    },

    //boldAndItalic
    {
        regex: /(?:\*\*\*|___)(.*?)(?:\*\*\*|___)/gmi,
        replacer: (_: string, content: string): `<em>${string}</em>` => `<em>${content}</em>`,
    },

    //bold
    {
        regex: /(?:\*\*|__)(.*?)(?:\*\*|__)/gmi,
        replacer: (_: string, content: string): `<strong>${string}</strong>` => `<strong>${content}</strong>`,
    },

    //italic
    {
        regex: /(?:\*|_)(.*?)(?:\*|_)/gmi,
        replacer: (match: string, content: string): `<em>${string}</em>` => `<em>${content}</em>`,
    },

    //strikethrough
    {
        regex: /(?:~~)(.*?)(?:~~)/gmi,
        replacer: (_: string, $1: string): string => `<del>${$1}</del>`
    },

    //quote
    {
        regex: /:"(.*?)":/gmi,
        replacer: (_: string, content: string): string => `<q>${content}</q>`,
    },

    //blockCode
    {
        regex: /```([^```]+)```/gmi,
        replacer: (_: string, content: string): string => `<pre><code>${content}</code></pre>`,
    },

    //inlineCode
    {
        regex: /`([^`]+)`/gmi,
        replacer: (_: string, content: string): string => `<code>${content}</code>`,
    },

    //ulLists
    {
        regex: /\*+(.*)?/gmi,
        replacer: (_: string, content: string): string => `<ul><li>${content.trim()}</li></ul>`,
    },

    //olLists
    {
        regex: /[0-9]+\.(.*)/gmi,
        replacer: (_: string, content: string): string => `<ol><li>${content.trim()}</li></ol>`,
    },

    //hr
    {
        regex: /\n-{5,}/gmi,
        replacer: (): string => '<hr />',
    },

    //blockQuote
    {
        regex: /\n(&gt;|>)(.*)/gmi,
        replacer: (_: string, $1: string, content: string): string => `\n<blockquote>${content}</blockquote>`,
    },

    //paragraphs
    {
        regex: /\n([^\n]+)\n/gmi,
        replacer: (_: string, content: string): string =>
        {
            const trimmed: string = content.trim();

            return /^<\/?(ul|ol|li|h|p|bl|code|table|tr|td)/i.test(trimmed)
                ? `\n${trimmed}\n`
                : `\n<p>${trimmed}</p>\n`;
        },
    },

    //Fix Ul
    {
        regex: /<\/ul>\s?<ul>/gmi,
        replacer: (): string => '',
    },

    //Fix Ol
    {
        regex: /<\/ol>\s<ol>/gmi,
        replacer: (): string => '',
    },

    //Fix Blockquote
    {
        regex: /<\/blockquote>\s?<blockquote>/gmi,
        replacer: (): string => '',
    },
];

const markdownPolicy = window.trustedTypes!.createPolicy('@fyn-software/markdownPolicy', {
    createHTML: (markdown: string): string => {
        for (const rule of rules)
        {
            markdown = markdown.replace(rule.regex, rule.replacer);
        }

        return markdown.trim();
    },
});

export function md(strings: TemplateStringsArray, ...args: Array<any>)
{
    return markdownPolicy.createHTML(strings.join(''));
}