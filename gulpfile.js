import gulp from 'gulp'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import pug from 'gulp-pug'
import autoprefixer from 'gulp-autoprefixer'
import uglify from 'gulp-uglify'
import browserSync from 'browser-sync'
import rename from 'gulp-rename'
import path from 'path'
import debug from 'gulp-debug'

const paths = {
	'root'    : './dist/',
	'pug'     : './src/pug/**/*.pug',
	'html'    : './dist/**/*.html',
	'cssSrc'  : './src/scss/**/*.scss',
	'cssDist'   : './dist/css/',
	'jsSrc' : './src/js/**/*.js',
	'jsDist': './dist/js/',
	'src'    :'./src/'
  }

// gulp.task( 'pug', function() {
// 	return gulp
// 		.src([ 'src/pug/**/*.pug', '!src/pug/**/*.pug' ])
// 		.pipe(pug({
// 			pretty: true
// 		}))
// 		.pipe( gulp.dest( './' ) );
// });

gulp.task('sass', function () {
	console.log("pug");
	return (
	  gulp.src(paths.cssSrc)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(sass({
		  outputStyle: 'expanded'// Minifyするなら'compressed'
		}))
		.pipe(autoprefixer({
		  browsers: ['ie >= 11'],
		  cascade: false,
		  grid: true
		  }))

		
		
		.pipe(gulp.dest(paths.cssDist))
	);
  });

  //pug
gulp.task('pug', function () {
	return (
	  gulp.src(['./src/pug/**/*.pug', '!./src/pug/**/_*.pug'], {base: './src/pug/'})
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(pug({
		  pretty: true
		}))
		// .pipe(rename((path) => {
        //     path.dirname = './index';
        // }))
		
		.pipe(gulp.dest('./dist/'),)
		.pipe(debug({ title: 'Debug:' })) // 生成されたファイルとディレクトリをコンソールに表示
	);
  });

  // js
  gulp.task('js', function () {
	return (
	  gulp.src(paths.jsSrc)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(paths.jsDist))
	);
  });
  
  // browser-sync
  gulp.task('browser-sync', () => {
	return browserSync.init({
		server: {
			baseDir: paths.root
		},
		port: 8080,
		reloadOnRestart: true
	});
  });
  
  // browser-sync reload
  gulp.task('reload', (done) => {
	browserSync.reload();
	done();
  });
  
  //watch
  gulp.task('watch', (done) => {
	gulp.watch([paths.cssSrc], gulp.series('sass', 'reload'));
	gulp.watch([paths.jsSrc], gulp.series('js', 'reload'));
	gulp.watch([paths.pug], gulp.series('pug', 'reload'));
	done();
  });
  gulp.task('default', gulp.parallel('watch', 'browser-sync'));