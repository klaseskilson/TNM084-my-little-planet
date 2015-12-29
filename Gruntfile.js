module.exports = function(grunt) {
  // get rid of annoying grunt task loading
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'http-server': {
      dev: {
        port: 3000,
        runInBackground: true,
        cahce: 0
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          // '': ''
        }
      }
    },
    watch: {
      client: {
        files: ['**.js', 'index.html'],
        tasks: ['build'],
      },
    },
    jshint: {
      file: ['src/**/*.js']
    },
    concat: {
      options: {
        separator: ';\n',
        sourceMap: true
      },
      dist: {
        // the files to concatenate
        src: ['src/**/*.js'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>']
        }
      }
    },
    cacheBust: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8,
        deleteOriginals: true
      },
      assets: {
        files: [{
          src: ['index.html', '<%= concat.dist.dest %>']
        }]
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'babel', 'concat']);
  grunt.registerTask('dev', ['build', 'http-server', 'watch']);
  grunt.registerTask('deploy', ['build', 'uglify', 'cacheBust']);
  grunt.registerTask('default', ['dev']);
};
