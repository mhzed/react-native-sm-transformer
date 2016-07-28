// react-native start --transformer ./smTransform.js

var transformer = require('react-native/packager/transformer');
var fs = require("fs");
var sourceMap = require("source-map")

const lc =  (str) => {
  c = 0
  for (let ch of str) {
    if (ch == "\n") c++;
  }
  return c
}

// line to line mapping of sourcemap
const smOneToOne = (srcfile, src)=>{
  "use strict";
  let map = new sourceMap.SourceMapGenerator({file:srcfile})
  let n = lc(src)
  for (let line =1; line <= n; line++)
    map.addMapping({
      source: srcfile,
      original : {line, column:0},
      generated : {line, column:0}
    })
  return map.toJSON()
}


module.exports = function (data, callback) {
  let smfile = data.filename + ".map";

  if (fs.existsSync(smfile)) {
    transformer(data, (err, tdata)=>{
      "use strict";
      var smap = JSON.parse(fs.readFileSync(smfile).toString())
      tdata.map = smap;
      callback(null, tdata);
    })

  } else {
    transformer(data, (err, mod)=>{
      "use strict";
      if (!mod.map) {
        mod.map = smOneToOne(mod.filename, mod.code)
      }
      return callback(err, mod);
    });
  }
};