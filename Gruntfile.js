module.exports = function(grunt) {
    var configs = '_js/globals/configs/production.js',
        i = 0,
        len = grunt.cli.tasks.length;

    //SET GLOBAL CONFIGS BASED ON ENVIROMENT OR TASK
    for (i; i < len; i++) {
        if (grunt.cli.tasks[i] === 'dev') {
            configs = '_js/globals/configs/development.js';
        }
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            libs: {
                files: {
                    '_js/bundled/header.js': '_js/header.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            navs: {
                files: {
                    '_js/bundled/navs.js': '_js/navs.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            slideshow: {
                files: {
                    '_js/bundled/slideshow.js': '_js/slideshow.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            video: {
                files: {
                    '_js/bundled/playlist.js': '_js/playlist.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            select: {
                files: {
                    '_js/bundled/selects.js': '_js/selects.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            parallax: {
                files: {
                    '_js/bundled/parallax-images.js': '_js/parallax-images.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            banners: {
                files: {
                    '_js/bundled/page-banners.js': '_js/page-banners.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            top: {
                files: {
                    '_js/bundled/top-btn.js': '_js/top-btn.js'
                },
                options: {
                    transform: ['babelify']
                }
            },
            carousel: {
                files: {
                    '_js/bundled/carousel.js': '_js/carousel.js'
                },
                options: {
                    transform: ['babelify']
                }
            }
        },
        watch: {
            scripts: {
                files: ['_js/*.js', '_js/modules/*.js'],
                tasks: ['browserify', 'uglify'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: true,
                compress: true,
                beautify: false
            },
            build: {
                files: [{
                    src: [
                        '_js/bundled/header.js',
                        '_js/bundled/navs.js',
                        '_js/bundled/slideshow.js',
                        '_js/bundled/playlist.js',
                        '_js/bundled/selects.js',
                        '_js/bundled/parallax-images.js',
                        '_js/bundled/top-btn.js',
                        '_js/bundled/carousel.js'
                    ],
                    dest: 'e2/js/rv7/armydotmil/<%= pkg.name %>.min.js'
                },
                {
                    src: [
                        '_js/bundled/page-banners.js'
                    ],
                    dest: 'e2/js/rv7/armydotmil/banners.min.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    // grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    // grunt.loadNpmTasks('grunt-text-replace');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('production', ['browserify', 'uglify']);

};
