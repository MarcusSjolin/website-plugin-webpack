var path = require("path")

var renderedBundles = {
    
}

exports = module.exports = function(app) {
    app.registerListener ("preGetAsset", function(err, req, res) {
        var route = req.route.query
        
        if (req.route.query in renderedBundles) {
            res.sendFile(renderedBundles[req.route.query])
        } else {
            route = route.replace(/\/assets\/[^\/]*/, "")

            var assetPath = app.assetsAvailable[req.params.id].path

            var webpack = require("webpack");

            var webpackConfig = require(assetPath + "/webpack.config")(assetPath, process.cwd(), route)
            // returns a Compiler instance
            var compiler = webpack(webpackConfig).watch({

            }, function(err, stats) {
                if(err)
                    return console.log(err);
                var jsonStats = stats.toJson();
                if(jsonStats.errors.length > 0)
                    return console.log(jsonStats.errors);
                if(jsonStats.warnings.length > 0)
                    console.warn(jsonStats.warnings);

                if ( ! (req.route.query in renderedBundles)) {
                    renderedBundles[req.route.query] = stats.compilation.outputOptions.path + "/" + stats.compilation.outputOptions.filename
                    res.sendFile(stats.compilation.outputOptions.path + "/" + stats.compilation.outputOptions.filename)
                }
            });
        }
    })
}
