const { src, dest, series, watch } = require(`gulp`),
    htmlCompressor = require(`gulp-htmlmin`), //done
    cssCompressor = require(`gulp-clean-css`), //done 
    jsValidator = require(`gulp-eslint`), //done
    babel = require(`gulp-babel`), //done
    jsCompressor = require(`gulp-uglify`), //done
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;


let validateHTML = () => {
    return src([
        `*.html`])
        .pipe(htmlValidator(undefined));
};

let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsValidator())
        .pipe(jsValidator.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let compressHTML = () => {
    return src([`./*.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressCSS = () => {
    return src(`dev/css/style.css`)
        .pipe(cssCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let validateJS = () => {
    return src(`dev/js/app.js`)
    .pipe(jsValidator())
    .pipe(jsValidator.formatEach(`compact`, process.stderr));
};


let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let lintCSS = () => {
    return src(`css/*.css`)
        .pipe(lintCSS({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};



let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
              `css`,
              `js`,
              `./`
            ]
        }
    });

    watch(`js/*.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`*.html`, validateHTML)
        .on(`change`, reload);

    watch(`img/*`)
        .on(`change`, reload);

    watch(`css/*.css`,
        series(lintCSS)
    ).on(`change`, reload);
};


exports.validateHTML = validateHTML;
exports.lintJS = lintJS;
exports.validateJS = validateJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.CSSLinter = lintCSS;
exports.transpileJSForProd = transpileJSForProd;
exports.serve = series(
    validateHTML,
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    transpileJSForProd,
);