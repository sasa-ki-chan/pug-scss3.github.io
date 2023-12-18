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
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import changed from 'gulp-changed';

// const imageminOption = [
//     imageminPngquant({ quality: [.65, .80] }),　//任意で追加
//     imageminMozjpeg({ quality: 80 }),　//デフォルト（新）
//     imagemin.gifsicle(),　//デフォルト
//     imagemin.optipng(),　//デフォルト
//     imagemin.svgo()　//デフォルト
// ];

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
		'img' :'./src/img/',
		'js'  :'./src/js/**/*.js'
	},

	dest : {
		'html' :'./dist/',
		'css'  :'./dist/css/',
		'img' :'./dist/img/',
		'js'   :'./dist/js/*.js'
	}

  };

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
		.pipe(changed(paths.src.sass))
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
		.pipe(changed(paths.src.pug))
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

  //img
  gulp.task('img', function() {
	return (
		gulp.src([paths.src.img],  {base: './src/img/'})
		.pipe(changed(paths.src.img))
		// .pipe(
		// 	// imagemin([
		// 	// 	imageminPngquant({
		// 	// 	quality: [.60, .70], // 画質
		// 	// 	speed: 1 // スピード
		// 	//   }),
		// 	//   imageminMozjpeg({ quality: 65 }), // 画質
		// 	// //   imagemin.svgo(),
		// 	// //   imagemin.optipng(),
		// 	// //   imagemin.gifsicle({ optimizationLevel: 3 }) // 圧縮率
		// 	// ])
		// )
		.on('error', function (err) {
			console.error(err);
			this.emit('end'); // エラーが発生してもストリームを終了させないようにする
		})
		.pipe(gulp.dest(paths.dest.img))
		.pipe(debug({ title: 'Debug:' })) // 生成されたファイルとディレクトリをコンソールに表示
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
	gulp.watch([paths.src.img], gulp.series('img', 'reload'));
	done();
  });
  gulp.task('default', gulp.parallel('watch', 'browser-sync'));