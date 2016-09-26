var syncLoad = require('bundle-loader!./a.js')

//用的不多 可以了解这个知识
syncLoad( function(file) {
  document.open();
  document.write('<h1>' + file + '</h1>');
  document.close();
})
