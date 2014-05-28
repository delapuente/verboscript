module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var srcFiles = [
    '<%= dirs.src %>/**/*.js'
  ];

  var demoSrcFiles = [
    '<%= dirs.demo %>/scripts/**/*.js'
  ];

  var specFiles = [
    '<%= dirs.spec %>/**/*.js'
  ];

  var banner = [
    '/**',
    ' * @license',
    ' * <%= libname %> - v<%= pkg.version %>',
    ' * Copyright (c) 2014, Salvador de la Puente',
    ' * <%= pkg.homepage %>',
    ' *',
    ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
    ' *',
    ' * <%= libname %> is licensed under the <%= pkg.license %> License.',
    ' * <%= pkg.licenseUrl %>',
    ' */',
    ''
  ].join('\n');

  grunt.initConfig({

    libname: '<%= pkg.name %>',

    dirs: {
      src: 'grammar',
      bin: 'dist',
      build: 'build',
      demo: 'demo',
      test: 'test',
      spec: '<%= dirs.test %>/spec',
      tmp: '.tmp'
    },

    files: {
      testRunner: '<%= dirs.test %>/spec_runner.js',
      grammar: '<%= dirs.src %>/<%= libname %>.pegjs',
      build: '<%= dirs.bin %>/<%= libname %>.js',
      buildMin: '<%= dirs.bin %>/<%= libname %>.min.js',
      preBuild: '<%= dirs.tmp %>/<%= libname %>.js',
      intro: '<%= dirs.build %>/_intro.js',
      outro: '<%= dirs.build %>/_outro.js'
    },

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: {
        src: ['dist/*']
      },
      temp: {
        src: ['.tmp/*']
      }
    },

    concat: {
      options: {
        separator: '\n\n'
      },
      pack: {
        src: [
          '<%= files.intro %>',
          '<%= files.preBuild %>',
          '<%= files.outro %>'
        ],
        dest: '<%= files.build %>',
        options: { process: true }
      }
    },

    connect: {
      options: {
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0',
        open: true
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect().use('/src', connect.static('src')),
              connect.static('test')
            ];
          }
        }
      },
      debug: {
        options: {
          port: 9002,
          livereload: 35729,
          middleware: function(connect) {
            return [
              connect().use('/src', connect.static('src')),
              connect.static('test')
            ];
          }
        }
      },
      playground: {
        options: {
          port: 9003,
          livereload: 35730,
          middleware: function(connect) {
            return [
              connect().use('/dist', connect.static('dist')),
              connect.static('playground')
            ];
          }
        }
      }
    },

    jshint: {
      files: srcFiles
             .concat(demoSrcFiles)
             .concat(specFiles)
             .concat('Gruntfile.js'),
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: false,
          urls: [
            'http://<%= connect.test.options.hostname %>:' +
            '<%= connect.test.options.port %>/index.html'
          ]
        }
      }
    },

    peg: {
      pack: {
        src: '<%= files.grammar %>',
        dest: '<%= files.preBuild %>'
      }
    },

    uglify: {
      options: {
        banner: banner
      },
      pack: {
        files: {
          '<%= files.buildMin %>': ['<%= files.build %>']
        }
      }
    },

    watch: {
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      test: {
        files: srcFiles.concat(specFiles).concat('<%= files.testRunner %>'),
        tasks: ['connect:test', 'mocha']
      },
      debug: {
        files: srcFiles.concat(specFiles).concat('<%= files.testRunner %>'),
        tasks: [],
        options: {
          livereload: 35729
        }
      },
      playground: {
        files: '<%= files.grammar %>',
        tasks: [],
        options: {
          livereload: 35730
        }
      }
    }
  });

  grunt.registerTask('default', ['lint', 'test', 'pack', 'min']);
  grunt.registerTask('dist', ['pack', 'min']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['connect:test', 'mocha']);
  grunt.registerTask('tests', ['test']);
  grunt.registerTask('pack', [
    'clean:dist',
    'clean:temp',
    'peg:pack',
    'concat:pack'
  ]);
  grunt.registerTask('min', ['uglify:pack']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('playground', ['connect:playground', 'watch:playground']);
  grunt.registerTask('debug', ['connect:debug', 'watch:debug']);
};
