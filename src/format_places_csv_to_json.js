"use strict";

let COUNTRY_CODE = "NG";
let ALLOWED_TIMEZONE = "N/A"; // set to "N/A" or "" if doesn't matter (case sensitive!)
let MIN_LATITUDE = ""; // set to "N/A" or "" if doesn't matter (case sensitive!)
let MIN_LONGITUDE = 0; // set to "N/A" or "" if doesn't matter (case sensitive!)
let MAX_LONGITUDE = "N/A"; // set to "N/A" or "" if doesn't matter (case sensitive!)

if(ALLOWED_TIMEZONE === "")
{
	ALLOWED_TIMEZONE = "N/A";
}
if(MIN_LATITUDE === "")
{
	MIN_LATITUDE = "N/A";
}
if(MIN_LONGITUDE === "")
{
	MIN_LONGITUDE = "N/A";
}
if(MAX_LONGITUDE === "")
{
	MAX_LONGITUDE = "N/A";
}

/*
	COLUMNS
	geonameid         0
	name              1
	asciiname         2
	alternatenames    3
	latitude          4
	longitude         5
	feature class     6
	feature code      7
	country code      8
	cc2               9
	admin1 code       10
	admin2 code       11
	admin3 code       12
	admin4 code       13
	population        14
	elevation         15
	dem               16
	timezone          17
	modification date 18
	
	http://download.geonames.org/export/dump/readme.txt
*/

let FS = require("fs");

let inputFilePath = "data/geonames/"+ COUNTRY_CODE +".txt";
let outputFilePath = "data/geonames/"+ COUNTRY_CODE +".json";

let data = [];

let csvData = FS.readFileSync(inputFilePath, "utf8").split("\n");
for(let i in csvData)
{
	let place = csvData[i].split("\t");
	
	if(
		place[6] == "P" &&
		(place[17] == ALLOWED_TIMEZONE || ALLOWED_TIMEZONE == "N/A") &&
		(MIN_LATITUDE == "N/A" || place[4] >= MIN_LATITUDE) &&
		(MIN_LONGITUDE == "N/A" || place[5] >= MIN_LONGITUDE) &&
		(MAX_LONGITUDE == "N/A" || place[5] <= MAX_LONGITUDE)
	)
	{
		data.push(
			{
				"name": place[1],
				"latitude": place[4],
				"longitude": place[5]
			}
		);
	}
}

console.log("Places: "+ data.length);

FS.writeFileSync(outputFilePath, JSON.stringify(data), "utf8");