var path = require("path")
var fs = require("fs")
var webpack = require("webpack")

module.exports = function(app) {
    for (var i in app.plugins) {
        addPlugin(app)(null, app.plugins[i])
    }

    app.registerListener ("preAddPlugin", addPlugin(app))
}

function addPlugin(app) {
    return function (err, plugin) {
        if (! fs.existsSync (plugin.path + "/webpack.config.js")) {
            return
        }

        var webpackConfig = require(plugin.path + "/webpack.config")(plugin.path, process.cwd())
        // returns a Compiler instance
        var compiler = webpack(webpackConfig).watch({

        },function(err, stats) {
            if(err)
                return app.log('error', err);
            var jsonStats = stats.toJson();
            if(jsonStats.errors.length > 0)
                return app.log('error', jsonStats.errors);
            if(jsonStats.warnings.length > 0)
                app.log('warn', jsonStats.warnings);

            if (app.isDev()) {
                app.devReload()
            }
        });
    }
}
