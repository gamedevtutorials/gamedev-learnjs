/**
 * Created by Gilles on 05.05.2016.
 */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-connect');


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
    }
  });




};