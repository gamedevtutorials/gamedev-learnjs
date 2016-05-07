/**
 * Created by Gilles on 05.05.2016.
 */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      "EasyScript" : {
        "src" : "src/plugins/Easyscript/*.js",
        "dest" : "js/plugins/EasyScript.js"
      },
      "NwesLoader" : {
        "src" : "src/plugins/Newsloader/*.js",
        "dest" : "js/plugins/Newsloader.js"
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
        src: "src/*.js",
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
            src: ['src/*.js'],
            dest: 'js/',
            filter: "isFile",
            flatten : true
          }
        ]
      },
      build : {
        files: [

          {
            expand: true,
            src: ['**'],
            dest: 'build/',
            flatten : false,
            filterFileExceptions : [".idea",".gitignore","node_modules","Gruntfile.js","package.json","src","README.md"],
            filter: function(filepath) {
              var allowed = true;
              var exceptions = this.filterFileExceptions||[];
              for(var i=0; i < exceptions.length; i++) {
                if(filepath.replace("\\","/").indexOf(exceptions[i].replace("\\","/")) == 0) {
                  allowed = false;
                  break;
                }
              }
              return allowed;
            }
          }

        ]
      }
    },
    watch: {

      plugins:{
        files: 'src/plugins/**/*.js',
        tasks: ['dev-buildPlugins']
      },
      options: {
        debounceDelay: 3000,
        atBegin: true
      }
    },
    clean: {
      build: ['build']
    }

  });

  grunt.registerTask("dev-restoreMainFiles",["copy:main"]);
  grunt.registerTask("dev-buildPlugins",["concat"]);
  grunt.registerTask("dev-watchTask",["watch:plugins"]);
  grunt.registerTask("prod-build",["concat", "uglify"]);
  grunt.registerTask("html-server",["connect:server"]);
  grunt.registerTask("prod-build",["clean:build","copy:build"]);


};