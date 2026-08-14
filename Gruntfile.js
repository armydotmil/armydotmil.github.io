const esbuild = require('esbuild');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['_js/*.js', '_js/modules/*.js'],
                tasks: ['bundle', 'uglify'],
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
                        '_js/bundled/rich-text.js',
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

    // replaces the old "browserify" dependency
    grunt.registerTask('bundle', 'Fast and secure bundling with esbuild', async function() {
        const done = this.async();
        
        try {
            await esbuild.build({
                entryPoints: {
                    'header.js': '_js/header.js',
                    'navs.js': '_js/navs.js',
                    'slideshow.js': '_js/slideshow.js',
                    'playlist.js': '_js/playlist.js',
                    'rich-text.js': '_js/rich-text.js',
                    'selects.js': '_js/selects.js',
                    'parallax-images.js': '_js/parallax-images.js',
                    'page-banners.js': '_js/page-banners.js',
                    'top-btn.js': '_js/top-btn.js',
                    'carousel.js': '_js/carousel.js'
                },
                outdir: '_js/bundled',
                bundle: true,
                minify: true,
                sourcemap: true,
                target: ['es2020'],
            });
            grunt.log.ok('esbuild completed successfully.');
            done();
        } catch (error) {
            grunt.log.error('esbuild failed: ', error);
            done(false);
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['bundle', 'uglify']);
    grunt.registerTask('production', ['bundle', 'uglify']);

};
