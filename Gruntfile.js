module.exports = function(grunt) {
  // get rid of annoying grunt task loading
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'http-server': {
      dev: {
        port: 3000,
        runInBackground: true,
        cache: 0
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
        options: {
          interrupt: true,
        },
        files: ['src/**/*.js', '**.css', 'index.html'],
        tasks: ['build'],
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build', 'concat:libs']
      }
    },
    jshint: {
      file: ['src/**/*.js']
    },
    concat: {
      options: {
        separator: ';\n',
        sourceMap: true
      },
      libs: {
        src: ['node_modules/three/three.js',
          'node_modules/stats.js/build/stats.min.js',
          'node_modules/lodash/index.js'
        ],
        dest: 'dist/libs.js'
      },
      client: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    concat_css: {
      options: {},
      all: {
        src: ['node_modules/normalize.css/normalize.css', 'stylesheets/**/*.css'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          '<%= concat.client.dest %>': ['<%= concat.client.dest %>'],
          '<%= concat.libs.dest %>': ['<%= concat.libs.dest %>']
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
          src: ['index.html', '<%= concat.client.dest %>', '<%= concat.libs.dest %>']
        }]
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'concat:client', 'concat_css']);
  grunt.registerTask('dev', ['build', 'concat:libs', 'http-server', 'watch']);
  grunt.registerTask('deploy', ['build', 'concat:libs', 'uglify', 'cacheBust']);
  grunt.registerTask('default', ['dev']);
};
