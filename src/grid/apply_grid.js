"use strict";

let FS = require("fs");

let GRID_FILE = "GB_IM_combined.json";
let DATA_FILE = "../data/geonames/GB_IM_combined.json";

let grid = JSON.parse(FS.readFileSync(GRID_FILE, "utf8"));
let data = JSON.parse(FS.readFileSync(DATA_FILE, "utf8"));

for(let d in data)
{
	for(let g in grid)
	{
		if(data[d].longitude >= grid[g]["X >"] && data[d].longitude <= grid[g]["X <"] && data[d].latitude >= grid[g]["Y >"] && data[d].latitude <= grid[g]["Y <"])
		{
			data[d].square = grid[g].id;
			break;
		}
	}
}

FS.writeFileSync(DATA_FILE, JSON.stringify(data, null, " "), "utf8");
