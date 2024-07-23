module.exports = function generateLinks(tags) {
    return tags
        .filter(tag => tag.tagName === 'script' && tag.attributes.src)
        .map(tag => `<script src="${tag.attributes.src}"></script>`)
        .join('\n');
};
