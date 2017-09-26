"use strict";

let DATA_PATH = "../data/geonames/IT.json";

let FS = require("fs");

let data = JSON.parse(FS.readFileSync(DATA_PATH, "utf8"));

let csv = "north,east";

for(let i = 0; i < data.length; i++)
{
	csv +="\n"+ data[i].latitude +","+ data[i].longitude;
}

FS.writeFileSync("_background.csv", csv, "utf8");