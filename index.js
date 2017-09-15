// react-native start --transformer ./smTransform.js

var transformer = require('react-native/packager/transformer');
var fs = require("fs");
var sourceMap = require("source-map");
var path = require('path');

const lc = (str) => {
  let c = 0
  for (let ch of str) {
    if (ch === "\n") c++;
  }
  return c
}

// line to line mapping of sourcemap
const smOneToOne = (srcfile, src) => {
  "use strict";
  let map = new sourceMap.SourceMapGenerator({file: srcfile})
  let n = lc(src)
  for (let line = 1; line <= n + 1; line++) {
    map.addMapping({
      source: srcfile,
      original: {line, column: 0},
      generated: {line, column: 0}
    })
  }
  return map.toJSON()
}

module.exports = function (data, callback) {
  let smfile = data.filename + ".map";

  if (fs.existsSync(smfile)) {
    transformer(data, (err, mod) => { // eslint-disable-line 
      "use strict";
      if (mod) {
        var smap = JSON.parse(fs.readFileSync(smfile).toString());

        // Use absolute paths so further transformations would be able to resolve original files
        smap.sources = smap.sources.map(source => {
          return path.join(path.dirname(smfile), source);
        });

        mod.map = smap;
      }
      callback(null, mod);
    })
  } else {
    transformer(data, (err, mod) => {
      "use strict";
      if (mod && !mod.map) {
        mod.map = smOneToOne(mod.filename, mod.code)
      }
      return callback(err, mod);
    });
  }
};
