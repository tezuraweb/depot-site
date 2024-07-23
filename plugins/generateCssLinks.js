module.exports = function generateLinks(tags) {
    return tags
        .filter(tag => tag.tagName === 'link' && tag.attributes.rel === 'stylesheet')
        .map(tag => `<link href="${tag.attributes.href}" rel="stylesheet">`)
        .join('\n');
};