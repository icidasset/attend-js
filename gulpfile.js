var gulp = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");


gulp.task("default", function() {
  return gulp
    .src([
      "./lib/namespace.js",
      "./lib/helpers.js",
      "./lib/dom-observer.js",
      "./lib/component.js",
      "./lib/component-binder.js"
    ])
    // .pipe(uglify())
    .pipe(concat("attend.js"))
    .pipe(gulp.dest("./dist/"));
});
