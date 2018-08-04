module.exports = {
  staticFileGlobs: [
    'public/css/**.css',
    'public/**.css',
    'public/js/**.js',
    'public/404.html',
    'public/**.js',
    'public/js/offline.js',
    'public/js/pwa.js'
  ],
  importScripts: ['/js/offline.js'],
  stripPrefix: 'public'
};