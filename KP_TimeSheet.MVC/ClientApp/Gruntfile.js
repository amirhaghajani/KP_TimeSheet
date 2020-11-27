var targetDir = '../wwwroot/js';


module.exports = function (grunt) {

  grunt.initConfig({
    'myConfig': {
      'vendor_modules': [
        'jquery',
        // 'angular',
        // 'bootstrap-sass',
        // 'angular-route',
        // 'angular-sanitize',
        // 'restangular',
        // 'jquery.cookie',
        // 'lodash',
        // 'underscore.string',
        // 'lodash-deep'
      ],
      'srcArray':[
        'src/index.js', 
        'src/index2.js'
      ],
      'targetArray':[
        '../wwwroot/js/app.js', 
        '../wwwroot/js/app2.js'
      ],
      'srcCSS':[
        'node_modules/bootstrap/dist/css/bootstrap.min.css'
      ],
      'targetCSS':[
       '../wwwroot/css/bootstrap.min.css'
      ]
    },
    uglify: {
      dist: {
        files: {
          '../wwwroot/js/app.min.js': '../wwwroot/js/app.js',
          '../wwwroot/js/app2.min.js': '../wwwroot/js/app2.js',
          '../wwwroot/js/vendor.min.js': '../wwwroot/js/vendor.js',
        }
      }
    }
  });

  //----------------------------------------------------------
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.registerTask('default', ['uglify']);

  //---------------------------------------------------------
  grunt.registerTask('copyCss', function () {
    var done = this.async();
    var fs = require('fs');

    var srcArray = grunt.config.get('myConfig.srcCSS') || []; 
    var targetArray = grunt.config.get('myConfig.targetCSS') || []; 

    srcArray.map((src,index)=>{
      var target = targetArray[index];

      fs.copyFile(src, target, (err) => {
        if (err) throw err;
        console.log('%s was copied to %s',src,target);
      });
    })

    

  });
  //----------------------------------------------------------
  grunt.registerTask('browserify', function () {
    var done = this.async();
    var fs = require('fs');
    var browserify = require('browserify');

    var srcArray = grunt.config.get('myConfig.srcArray') || []; 
    var targetArray = grunt.config.get('myConfig.targetArray') || []; 

    srcArray.map((src, index) => {

      var target = targetArray[index];


      var browserify1 = new browserify({
        'cache': {},
        'packageCache': {}
      });

      browserify1.add(src);

      var compile = function (err, data) {
        grunt.log.writelns('compile: %s %s', src, target);
        if (err) return grunt.log.error(err);
        if (!data) return grunt.log.error('No data');
        grunt.file.mkdir(targetDir);
        fs.writeFileSync(target, data);
      };

      var vendorModules = grunt.config.get('myConfig.vendor_modules') || [];
      vendorModules.forEach(function (vm) {
        grunt.log.writelns('Excluding module from application bundle: %s', vm);
        browserify1.exclude(vm);
      });

      browserify1.bundle(compile);

    });


    //grunt.task.run('uglify');

  });

  //----------------------------------------------------------
  grunt.registerTask('browserify-vendor', function () {
    var done = this.async();
    var path = require('path');
    var fs = require('fs');
    var target = path.join('../wwwroot/js', 'vendor.js');
    var vendorModules = grunt.config.get('myConfig.vendor_modules') || [];
    var browserify = require('browserify')({
      'paths': ['.'],
      'fullPaths': true
    });
    vendorModules.forEach(function (vm) {
      browserify.require(vm);
    });
    browserify.bundle(function (err, data) {
      if (err) return grunt.fail.fatal(err);
      grunt.file.mkdir(path.join('dist'));
      fs.writeFileSync(target, data);
      done();
    });

    grunt.task.run('uglify');
  });

  //----------------------------------------------------------
  grunt.registerTask('watchify', function () {
    var done = this.async();
    var browserify = require('browserify');
    var watchify = require('watchify');
    var fs = require('fs');

    var srcArray = grunt.config.get('myConfig.srcArray') || []; 
    var targetArray = grunt.config.get('myConfig.targetArray') || [];

    srcArray.map((src, index) => {

      var target = targetArray[index];

      var browserify1 = new browserify({
        'cache': {},
        'packageCache': {}
      });
      browserify1 = watchify(browserify1);
      browserify1.add(src);
      var compile = function (err, data) {
        grunt.log.writelns('compile: %s %s', src, target);
        if (err) return grunt.log.error(err);
        if (!data) return grunt.log.error('No data');
        grunt.file.mkdir(targetDir);
        fs.writeFileSync(target, data);
      };

      var vendorModules = grunt.config.get('myConfig.vendor_modules') || [];
      vendorModules.forEach(function (vm) {
        grunt.log.writelns('Excluding module from application bundle: %s', vm);
        browserify1.exclude(vm);
      });

      browserify1.bundle(compile);

      browserify1.on('update', function () {
        browserify1.bundle(compile);
      });

      browserify1.on('log', function (msg) {
        grunt.log.oklns(msg);
      });

    })

  });
};