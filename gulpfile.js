const path = require("path");
const gulp = require("gulp");
const inSequence = require("run-sequence");
const gutil = require("gulp-util");
const clean = require("gulp-clean");
const jeditor = require("gulp-json-editor");
const ts = require("gulp-typescript");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const inject = require("gulp-inject");
const electron = require("electron-connect").server.create({path: "dist"});

// Process Error
function handleError(err) {
    console.log(err.toString());
    this.emit("end");
}

gulp.task("default", () => {
    inSequence(
        "clean",
        [
            "gen-app-package-json",
            "compile-main",
            "compile-renderer"
        ]
    );
});

// clean dist dir
gulp.task("clean", () => {
    return gulp.src("dist", {read: false})
        .pipe(clean());
});

// 生成 package.json
gulp.task("gen-app-package-json", () => {
    gutil.log("generate app package json file...");


    return gulp.src("package.json")
        .pipe(jeditor((json) => {
            let newJson = {
                name: json.name,
                description: json.description,
                version: json.version,
                main: json.main,
                author: json.author,
                dependencies: json.dependencies
            };

            return newJson;
        }))
        .pipe(gulp.dest("dist"));

});

gulp.task("compile-main", () => {
    let tsResult = gulp.src("src/main/**/*.ts")
        .pipe(ts({
            target: "es5",
            module: "commonjs",
            moduleResolution: "node"
        }));

    return tsResult.js
        .pipe(gulp.dest("dist/main"));
});

gulp.task("compile-renderer", () => {

    return gulp.src("src/renderer/Entry.tsx")
        .pipe(webpackStream({
            devtool: "source-map",
            watch: false,
            output: {
                filename: "js/entry.js"
                // filename: "entry.[chunkhash].js"
            },
            externals: ["electron"],
            resolve: {
                // Add `.ts` and `.tsx` as a resolvable extension.
                extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },
            module: {
                loaders: [
                    {
                        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        loader: "file-loader",
                        query: {
                            name: "images/[name].[ext]",
                            publicPath: "../"
                        }
                    },
                    { test: /\.tsx?$/, loader: "ts-loader" },
                    { test: /\.scss$/, loader: ExtractTextPlugin.extract(["css", "sass"])}
                ],
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: "index.html",
                    template: "src/renderer/assets/index.html",
                    inject: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                    },
                    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                    chunksSortMode: "dependency",
                    chunks: ["main", "vendor", "manifest"]
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: "vendor",
                    filename: "js/vendor.js",
                    minChunks: function (module, count) {
                        // any required modules inside node_modules are extracted to vendor
                        return (
                            module.resource &&
                            /\.js$/.test(module.resource) &&
                            module.resource.indexOf(
                                path.join(__dirname, "node_modules")
                            ) === 0
                        );
                    }
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: "manifest",
                    filename: "js/manifest.js",
                    chunks: ["vendor"]
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new ExtractTextPlugin("css/styles.css")
                // new ExtractTextPlugin("styles.[chunkhash].css")
            ]
        }))
        .on("error", handleError)
        .pipe(gulp.dest("dist/renderer"));
});

gulp.task("watch-compile", () => {
    gulp.watch(["renderer/assets/*.html", "src/renderer/**/*.tsx", "src/renderer/**/*.scss"], ["compile-renderer"]);
    gulp.watch(["src/main/**/*.ts"], ["compile-main"]);
});

gulp.task("watch-electron", () => {
    // Start browser process
    electron.start();

    // Restart browser process
    gulp.watch("dist/main/**/*.js", electron.restart);

    // Reload renderer process
    gulp.watch(["dist/renderer/*.html"], electron.reload);
});

gulp.task("watch", () => {
    gulp.start("watch-compile");
    gulp.start("watch-electron");
});

gulp.task("dev", () => {
    inSequence(
        "clean",
        [
            "gen-app-package-json",
            "compile-main",
            "compile-renderer"
        ],
        "watch"
    );
});

