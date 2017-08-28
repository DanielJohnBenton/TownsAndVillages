"use strict";

let __fs = require("fs");

let raw = __fs.readFileSync("background.txt", "utf8").split("\r\n");

let x = raw[0].split("\t");
let y = raw[1].split("\t");

let coords = "north,east\n";

for(let i in x)
{
	coords += y[i] +","+ x[i] +"\n";
}

__fs.writeFileSync("_background.csv", coords.trim(), "utf8");