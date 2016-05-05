/**
 * Created by Gilles on 05.05.2016.
 */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      "chainPlugin" : {
        "src" : "js/src/plugins/chaining/*.js",
        "dest" : "js/plugins/Chaining.js"
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          base: '.',
          open: true,
          keepalive: true
        }
      }
    },
    uglify : {
      mainFiles: {
        src: "js/src/*.js",
        "dest" : "js/",
        "expand" : true,
        "flatten" : true
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src: ['js/src/*.js'],
            dest: 'js/',
            filter: 'isFile',
            flatten : true
          }
        ]
      }
    },
    watch: {

      plugins:{
        files: 'js/src/plugins/**/*.js',
        tasks: ['dev-buildPlugins']
      },
      options: {
        debounceDelay: 3000,
        atBegin: true
      }
    }

  });

  grunt.registerTask("dev-restoreMainFiles",["copy:main"]);
  grunt.registerTask("dev-buildPlugins",["concat"]);
  grunt.registerTask("dev-watchTask",["watch:plugins"]);
  grunt.registerTask("prod-build",["concat", "uglify"]);
  grunt.registerTask("html-server",["connect:server"]);


};