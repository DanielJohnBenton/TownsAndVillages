"use strict";

let FS = require("fs");

let NX = 10;
let NY = 10;
let FILE = "../data/geonames/FR.json";
let REF = "FR";

let data = JSON.parse(FS.readFileSync(FILE, "utf8"));

let minX = data[0].longitude - 0;
let maxX = minX;
let minY = data[0].latitude - 0;
let maxY = minY;

for(let i in data)
{
	data[i].longitude -= 0;
	data[i].latitude -= 0;
	
	if(data[i].longitude < minX)
	{
		minX = data[i].longitude;
	}
	
	if(data[i].longitude > maxX)
	{
		maxX = data[i].longitude;
	}
	
	if(data[i].latitude < minY)
	{
		minY = data[i].latitude;
	}
	
	if(data[i].latitude > maxY)
	{
		maxY = data[i].latitude;
	}
}

minX -= 0; maxX -= 0; minY -= 0; maxY -= 0; // wtf javascript

let grid = [];
let id = 0;

let intervalX = (maxX - minX) / NX;
let intervalY = (maxY - minY) / NY;

for(let x = minX; x < maxX; x += intervalX)
{
	for(let y = minY; y < maxY; y += intervalY)
	{
		id += 1;
		
		grid.push(
			{
				"id": id,
				"X >": x, "X <": x + intervalX,
				"Y >": y, "Y <": y + intervalY
			}
		);
	}
}

FS.writeFileSync("grids/"+ REF +".json", JSON.stringify(grid), "utf8");