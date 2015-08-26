var path = require("path")

exports = module.exports = function(app) {
    app.registerListener ("preGetAsset", function(err, req, res) {
        var route = req.route.query
        route = route.replace(/\/assets\/[^\/]*/, "")

        var assetPath = app.assetsAvailable[req.params.id].path

        var webpack = require("webpack");

        var webpackConfig = require(assetPath + "/webpack.config")(assetPath, process.cwd(), route)
        console.log(webpackConfig)
        // returns a Compiler instance
        var compiler = webpack(webpackConfig, function(err, stats) {
            if(err)
                return console.log(err);
            var jsonStats = stats.toJson();
            if(jsonStats.errors.length > 0)
                return console.log(jsonStats.errors);
            if(jsonStats.warnings.length > 0)
                console.warn(jsonStats.warnings);

            res.sendFile(stats.compilation.outputOptions.path + "/" + stats.compilation.outputOptions.filename)
        });

        /*
        compiler.run(function(err, stats) {
            console.log(err)
            if (err) {
                console.log(err)
                res.end(JSON.stringify(err))
            }
            //console.log(stats)
           res.sendFile(stats.compilation.outputOptions.path + "/" + stats.compilation.outputOptions.filename)
        });*/
    })
}
