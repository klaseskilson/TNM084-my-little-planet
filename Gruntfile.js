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
        files: ['**.js', '**.css', 'index.html'],
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
        src: ['node_modules/three/three.js', 'src/**/*.js'],
        // the location of the resulting JS file
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
          '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>'],
          'dist/<%= pkg.name %>.css': ['dist/<%= pkg.name %>.css']
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

  grunt.registerTask('build', ['jshint', 'babel', 'concat', 'concat_css']);
  grunt.registerTask('dev', ['build', 'http-server', 'watch']);
  grunt.registerTask('deploy', ['build', 'uglify', 'cacheBust']);
  grunt.registerTask('default', ['dev']);
};
