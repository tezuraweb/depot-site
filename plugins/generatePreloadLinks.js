module.exports = function generatePreloadLinks(tags) {
    return tags
        .filter(tag => tag.attributes && tag.attributes.href && tag.attributes.href.endsWith('.woff2'))
        .map(tag => {
            return `<link rel="preload" href="/dist/${tag.attributes.href}" as="font" type="font/woff2" crossorigin>`;
        })
        .join('\n');
};