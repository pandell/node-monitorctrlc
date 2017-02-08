var pkg = require("./package.json");
var fs = require("fs");

var pkgNoScripts = Object.assign({}, pkg, {
    "scripts": undefined
});

fs.writeFileSync("dist/package.json", JSON.stringify(pkgNoScripts, null, 2));
