'use strict';

const gulp = require('gulp'),
  webpack = require('gulp-webpack'),
  webpackConfig = require('./webpack.config'),
  browserSync = require('browser-sync').create(),
  server = require('gulp-develop-server'),
  clean = require('gulp-clean'),
  gulpSync = require('gulp-sync')(gulp),
  uglify = require('gulp-uglify');

gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'http://localhost:8000'
  });
});

gulp.task('webpack', () => {
  return gulp.src('.').pipe(webpack(webpackConfig)).pipe(gulp.dest("./public/dist/"));
});

gulp.task('clean', () => {
  return gulp.src(['public/dist']).pipe(clean());
});

gulp.task('minify', () => {
  return gulp.src('public/dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('reload', () => {
  setTimeout(() => {
    browserSync.reload();
  }, 500);
})

gulp.task('server-start', (cb) => {
  server.listen({
    path: './app.js'
  });
  cb(null);
});

gulp.task('server-restart', () => {
  server.restart();
})

gulp.task('build', gulpSync.sync(['clean', 'webpack', 'minify']));

gulp.task('watch', () => {
  gulp.watch(['app/*', 'app/**/*'], gulpSync.sync(['clean', 'webpack', 'reload']));
  gulp.watch(['config.js', 'app.js', 'models/*', 'controllers/*', 'routers/*', 'middlewares/*'], gulpSync.sync(['server-restart', 'reload']));
});

gulp.task('default', gulpSync.sync(['clean', 'webpack', 'server-start',
  'browser-sync', 'watch']));
