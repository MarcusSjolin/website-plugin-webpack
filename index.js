var path = require("path")
var fs = require("fs")
var webpack = require("webpack")

module.exports = function(app) {
    for (var i in app.plugins) {
        addPlugin(null, app.plugins[i])
    }

    app.registerListener ("preAddPlugin", addPlugin)
}

function addPlugin(err, plugin) {
    if (! fs.existsSync (plugin.path + "/webpack.config.js")) {
        return
    }

    var webpackConfig = require(plugin.path + "/webpack.config")(plugin.path, process.cwd())
    // returns a Compiler instance
    var compiler = webpack(webpackConfig).watch({
        
    },function(err, stats) {
        if(err)
            return console.log(err);
        var jsonStats = stats.toJson();
        if(jsonStats.errors.length > 0)
            return console.log(jsonStats.errors);
        if(jsonStats.warnings.length > 0)
            console.warn(jsonStats.warnings);
    });
}
