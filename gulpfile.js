

const gulp = require('gulp');
const { parallel, watch, series } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const gp = gulpLoadPlugins();
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const path = require('path');
const fs = require('fs');
const image = require("gulp-image");
const sassGlob = require('gulp-sass-glob');
let dev = true;

// get base folder
let gulpRanInThisFolder = process.cwd();
let baseFolder = gulpRanInThisFolder + '/app';


let config = {
    tmp: {
        img: 'app/assets/images',
        css: '.tmp/assets/css',
        js: '.tmp/assets/js',
        misc: 'app/assets/misc',
        html: '.tmp',
        font: '.tmp/assets/fonts',
        webpack: './webpack.dev.js'
    },
    dist: {
        img: 'dist/assets/images',
        css: 'dist/assets/css',
        js: 'dist/assets/js',
        misc: 'dist/assets/misc',
        html: 'dist',
        font: 'dist/assets/fonts',
        webpack: './webpack.prod.js'
    },
    app: {
        css: "app/assets/css/*.scss",
        js: "app/assets/js/*.js",
        twig: "app/*.twig",
        fonts: 'app/assets/fonts/**/*',
        images: [
            `app/assets/images/**/*`,
            `!app/assets/images/sprites-retina`,
            `!app/assets/images/sprites`,
            `!app/assets/images/sprites-retina/**`,
            `!app/assets/images/sprites/**`,
        ]
    }
};

function css() {
    return gulp.src(config.app.css)
        .pipe(gp.plumber())
        .pipe(gp.if(dev, sourcemaps.init()))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(gp.if(dev, sourcemaps.write()))
        .pipe(gp.autoprefixer({ Browserslist: ['> 1%', 'last 5 versions', 'Firefox ESR'] }))
        .pipe(gp.if(dev, gp.sourcemaps.write('.'), cleanCSS({ compatibility: 'ie8' })))
        .pipe(gp.if(dev, gulp.dest(config.tmp.css), gulp.dest(config.dist.css)))
        .pipe(gp.plumber.stop())
        .pipe(reload({
            stream: true
        }))
}

function js() {
    let tmp = require(config.tmp.webpack);
    let dist = require(config.dist.webpack)
    return gulp.src(config.app.js)
        .pipe(gp.plumber())
        .pipe(gp.if(dev,
            webpackStream(tmp, webpack),
            webpackStream(dist, webpack)))
        .pipe(gp.if(dev,
            gulp.dest(config.tmp.js),
            gulp.dest(config.dist.js)))
        .pipe(gp.plumber.stop())

};

function mergeData() {
    let mode = dev;
    return gulp.src(['app/*.twig'])
        .pipe(gp.plumber())
        .pipe(gp.tap(function (file, t) {
            fileNameWatch = path.basename(file.path, '.twig');
            let tempDataFiles = ['app/_data/global/*.json'];
            if (fs.existsSync('app/_data/pages/' + fileNameWatch + '.json')) {
                tempDataFiles.push('app/_data/pages/' + fileNameWatch + '.json');
            }
            return gulp.src(tempDataFiles)
                .pipe(gp.mergeJson({
                    fileName: fileNameWatch + '.json',
                    mergeArrays: false,
                    endObj : {
                        dev : mode
                    }
                }))
                .pipe(gulp.dest('app/_data/build/'));
        }))
        .pipe(gp.plumber.stop())
}

function html() {
    return gulp.src('app/*.twig')
        .pipe(gp.plumber())
        .pipe(gp.data(function (file) {
            fileNameWatch = path.basename(file.path, '.twig');
            return JSON.parse(fs.readFileSync('app/_data/build/' + fileNameWatch + '.json'));
        }))
        .pipe(gp.twig({
            base: baseFolder,
            functions: [
                {
                    name: "__",
                    func: function (string, theme) {
                        return string;
                    }
                },
                {
                    name: "parseFloat",
                    func: function (string) {
                        return parseFloat(string);
                    }
                },
                {
                    name: "placeholderSVG",
                    func: function (width, height) {
                        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + width + " " + height + "'%3E%3C/svg%3E"
                    }
                }
            ],
            filters: [
                {
                    name: "resize",
                    func: function (value) {
                        return value;
                    }
                }
            ]
        }))
        .pipe(gp.if(dev, gulp.dest(config.tmp.html), gulp.dest(config.dist.html)))
        .pipe(gp.plumber.stop())
};

function fonts() {
    return gulp.src(config.app.fonts)
        .pipe(gp.plumber())
        .pipe(gp.if(dev, gulp.dest(config.tmp.font), gulp.dest(config.dist.font)))
        .pipe(gp.plumber.stop());
}

function images() {
    return gulp.src(config.app.images)
        .pipe(gp.plumber())
        .pipe(gulp.dest(config.dist.img))
        .pipe(gp.plumber.stop());
}

function imageminify() {
    return gulp.src(config.app.images)
        .pipe(image({
            optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
            pngquant: ['--speed=1', '--force', 256],
            zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
            mozjpeg: ['-optimize', '-progressive'],
            gifsicle: ['--optimize'],
            svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors'],
            concurrent: 10,
            quiet: false
        }))
        .pipe(gulp.dest(config.dist.img))
}

function misc() {
    return gulp.src([
        `app/assets/misc/**/*`
    ])
    .pipe(gp.plumber())
    .pipe(gulp.dest(config.dist.misc))
    .pipe(gp.plumber.stop());
}

function serve(cb) {
    browserSync.init({
        notify: true,
        port: 9000,
        reloadDelay: 100,
        logLevel: 'info',
        online: true,
        open: 'external',
        server: {
            baseDir: ['.tmp', 'app'],
            directory: true,
            routes: {
                '/node_modules': 'node_modules',
            },
        },
    })
    watchFiles();
    cb();
}

function watchFiles() {
    watch('app/assets/css/**/*.scss', css);
    watch('app/assets/js/**/*.js', jsWatch);
    watch(['app/assets/images/**/*'], reloadBrowser);
    watch('app/**/*.twig').on('add', mergeDataWatch);
    watch('app/**/*.twig').on('change', htmlWatch);
    watch(['app/_data/global/*.json', 'app/_data/pages/*.json'], mergeDataWatch);
    watch('app/assets/misc/**/*', reloadBrowser);
}

function reloadBrowser(cb) {
    browserSync.reload();
    cb();
};

const mergeDataWatch = series(mergeData, html, reloadBrowser);
const jsWatch = series(js, reloadBrowser);
const htmlWatch = series(html, reloadBrowser);

function prodMode(cb) {
    dev = false;
    cb();
}
function devMode(cb) {
    dev = true;
    cb();
}

/// test
exports.css = css;
exports.js = js;
exports.html = html;
exports.data = mergeData;
exports.fonts = fonts;
exports.images = images;
exports.minimage = imageminify;

exports.serve = series(devMode, parallel(mergeData, js, fonts), css, html, serve);
exports.build = series(prodMode, parallel(mergeData, js, fonts, misc, imageminify), css, html);
exports.buildNonMinImage = series(prodMode, parallel(mergeData, js, fonts, misc, images), css, html);
///