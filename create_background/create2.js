"use strict";

let FS = require("fs");

let data = JSON.parse(FS.readFileSync("../data.json", "utf8"));

let csv = "north,east";

for(let i = 0; i < data.length; i++)
{
	csv +="\n"+ data[i].north +","+ data[i].east;
}

FS.writeFileSync("_background.csv", csv, "utf8");