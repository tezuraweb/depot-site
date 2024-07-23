const HtmlWebpackPlugin = require('html-webpack-plugin');

class PreloadFontPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('PreloadFontPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
                'PreloadFontPlugin',
                (data, cb) => {
                    // Фильтрация и добавление шрифтов
                    const fontAssets = Array.from(compilation.assetsInfo.keys())
                        .filter(assetName => assetName.endsWith('.woff2') || assetName.endsWith('.woff'));

                    fontAssets.forEach(fontAsset => {
                        data.headTags.push({
                            tagName: 'link',
                            voidTag: true,
                            attributes: {
                                rel: 'preload',
                                href: fontAsset,
                                as: 'font',
                                type: fontAsset.endsWith('.woff2') ? 'font/woff2' : 'font/woff',
                                crossorigin: 'anonymous'
                            }
                        });
                    });

                    cb(null, data);
                }
            );
        });
    }
}

module.exports = PreloadFontPlugin;
