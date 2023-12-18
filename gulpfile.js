import gulp from 'gulp';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import pug from 'gulp-pug';
import autoPrefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import path from 'path';
import debug from 'gulp-debug';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import changed from 'gulp-changed';

const paths = {
  root: './dist/',
  src: {
    pug: './src/pug/**/*.pug',
    sass: './src/scss/**/*.scss',
    img: './src/img/**/*.*',
    js: './src/js/**/*.js'
  },
  dest: {
    html: './dist/',
    css: './dist/css/',
    img: './dist/img/',
    js: './dist/js/*.js'
  }
};

const copyFiles = () => {
  return gulp
    .src('./dist/**/*/*')
    .pipe(gulp.dest('./docs'));
};

const compilePug = () => {
  return gulp
    .src([paths.src.pug, '!./src/pug/**/_*.pug'], { base: './src/pug/' })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(changed(paths.src.pug))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.dest.html))
    .pipe(debug({ title: 'Debug:' }));
};

const compileSass = () => {
  return gulp
    .src(paths.src.sass)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(changed(paths.src.sass))
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }))
    .pipe(autoPrefixer({
      cascade: false,
      grid: true
    }))
    .pipe(gulp.dest(paths.dest.css));
};

const minifyJS = () => {
  return gulp
    .src(paths.src.js)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.js));
};

const optimizeImages = () => {
  return gulp
    .src(paths.src.img)
    .pipe(imagemin([
      imageminPngquant({
        quality: [.60, .70],
        speed: 1
      }),
      imageminMozjpeg({ quality: 65 }),
    ]))
    .pipe(debug({ title: 'Debug:' }))
    .pipe(gulp.dest(paths.dest.img))
    .pipe(debug({ title: 'Debug:' }))
};

const browserSyncTask = () => {
  return browserSync.init({
    server: {
      baseDir: paths.root
    },
    port: 8080,
    reloadOnRestart: true
  });
};

const reloadBrowser = (done) => {
  browserSync.reload();
  done();
};

const watchFiles = (done) => {
  gulp.watch([paths.src.sass], gulp.series(compileSass, reloadBrowser));
  gulp.watch([paths.src.js], gulp.series(minifyJS, reloadBrowser));
  gulp.watch([paths.src.pug], gulp.series(compilePug, reloadBrowser));
  gulp.watch([paths.src.img], gulp.series(optimizeImages, reloadBrowser));
  done();
};

gulp.task('pug', compilePug);
gulp.task('sass', compileSass);
gulp.task('js', minifyJS);
gulp.task('img', optimizeImages);
gulp.task('browser-sync', browserSyncTask);
gulp.task('reload', reloadBrowser);
gulp.task('watch', watchFiles);
gulp.task('pages', copyFiles);

gulp.task('default', gulp.parallel('watch', 'browser-sync'));
