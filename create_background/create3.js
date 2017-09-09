"use strict";

let FS = require("fs");

let data = JSON.parse(FS.readFileSync("../data/geonames/GB_IM_combined.json", "utf8"));

let csv = "east,north";

for(let i = 0; i < data.length; i++)
{
	csv +="\n"+ data[i].latitude +","+ data[i].longitude;
}

FS.writeFileSync("_background.csv", csv, "utf8");