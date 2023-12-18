import gulp from 'gulp';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
// import nodesass from 'node-sass';
// import sass from 'sass';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import pug from 'gulp-pug';
import autoPrefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import path from 'path';
import debug from 'gulp-debug';

const paths = {
	'root'    : './dist/',
	// 'pug'     : './src/pug/**/*.pug',
	// 'html'    : './dist/**/*.html',
	// 'cssSrc'  : './src/scss/**/*.scss',
	// 'cssDist'   : './dist/css/',
	// 'jsSrc' : './src/js/**/*.js',
	// 'jsDist': './dist/js/',
	'src'    :'./src/',
	src : {
		'pug' :'./src/pug/**/*.pug',
		'sass':'./src/scss/**/*.scss',
		'js'  :'./src/js/**/*.js'
	},

	dest : {
		'html' :'./dist/',
		'css'  :'./dist/css/',
		'js'   :'./dist/js/'
	}

  }

// gulp.task( 'pug', function() {
// 	return gulp
// 		.src([ 'src/pug/**/*.pug', '!src/pug/**/*.pug' ])
// 		.pipe(pug({
// 			pretty: true
// 		}))
// 		.pipe( gulp.dest( './' ) );
// });

  //sass
gulp.task('sass', function () {
	return (
	  gulp.src(paths.src.sass)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(sass.sync({
		  outputStyle: 'expanded'// Minifyするなら'compressed'
		}))
		.pipe(autoPrefixer({
		//   browsers: ['ie >= 11'], //エラーを吐く
		  cascade: false,
		  grid: true
		  }))

		
		
		.pipe(gulp.dest(paths.dest.css))
	);
  });

  //pug
gulp.task('pug', function () {
	return (
	  gulp.src([paths.src.pug,'!./src/pug/**/_*.pug'], {base: './src/pug/'})
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(pug({
		  pretty: true
		}))
		// .pipe(rename((path) => {
        //     path.dirname = './index';
        // }))
		
		.pipe(gulp.dest(paths.dest.html),)
		.pipe(debug({ title: 'Debug:' })) // 生成されたファイルとディレクトリをコンソールに表示
	);
  });

  // js
  gulp.task('js', function () {
	return (
	  gulp.src(paths.src.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(paths.dest.js))
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
	gulp.watch([paths.src.sass], gulp.series('sass', 'reload'));
	gulp.watch([paths.src.js], gulp.series('js', 'reload'));
	gulp.watch([paths.src.pug], gulp.series('pug', 'reload'));
	done();
  });
  gulp.task('default', gulp.parallel('watch', 'browser-sync'));