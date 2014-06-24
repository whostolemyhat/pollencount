'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        app: './public', // path to app files
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                spawn: false
            },

            watchsass: {
                files: [
                    '<%= app %>/sass/**/*.scss',
                ],
                tasks: ['sass:dev']
            },

            js: {
                files: [
                    '<%= app %>/js/**/*.js'
                ],
                tasks: ['jshint', 'concat:dev'],
            },


            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= app %>/*.html',
                    '<%= app %>/js/**/*.js',
                    '<%= app %>/css/*.css',
                    '<%= app %>/img/*.{gif,jpg,jpeg,png,svg,webp}'
                ]
            }
        },

        sass: {
            dev: {
                options: {
                    // outputStyle: 'expanded',
                    lineNumbers: true
                },
                files: {
                    '<%= app %>/css/main.css': '<%= app %>/sass/main.scss',
                }
            },
            prod: {
                options: {
                    style: 'compressed',
                    lineNumbers: false
                },
                files: {
                    '<%= app %>/css/main.css': '<%= app %>/sass/main.scss',
                }
            }
        },

        // clean: [ '<%= app %>/build/' ],

        tag: {
            banner: '/* <%= pkg.name %>\n*/' +
                    '/* v<%= pkg.version %>\n*/' +
                    '/* <%= pkg.author %>\n*/' +
                    '/* Last updated: <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },

        uglify: {
            options: {
                banner: '<%= tag.banner %>'
            },
            dist: {
                src: ['<%= app %>/js/src/*.js'], // not vendor files
                dest: '<%= app %>/js/main.js'
            }
        },

        concat: {
            dev: {
                src: ['<%= app %>/js/src/*.js'],
                dest: '<%= app %>/js/main.js'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= app %>/js/*.js'
            ]
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost',
            },
            livereload: {
                options: {
                    base: ['<%= app %>']
                }
            }
        }

    });

    grunt.registerTask('default', ['connect:livereload', 'watch']);
    grunt.registerTask('build', ['uglify', 'sass:prod']);
};
