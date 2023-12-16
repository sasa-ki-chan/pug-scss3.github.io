import gulp from 'gulp'
import pug from 'gulp-pug'

gulp.task( 'pug', function() {
	return gulp
		.src([ 'pug/**/*.pug', '!pug/**/_*.pug' ])
		.pipe(pug({
			pretty: true
		}))
		.pipe( gulp.dest( './' ) );
});