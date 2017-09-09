"use strict";

let FS = require("fs");

let uk = JSON.parse(FS.readFileSync("data/geonames/GB.json", "utf8"));
let im = JSON.parse(FS.readFileSync("data/geonames/IM.json", "utf8"));

FS.writeFileSync("data/geonames/GB_IM_combined.json", JSON.stringify(uk.concat(im), null, " "), "utf8");