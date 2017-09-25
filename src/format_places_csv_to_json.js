"use strict";

let COUNTRY_CODE = "ES";
let ALLOWED_TIMEZONE = ""; // set to "N/A" or "" if doesn't matter

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
	
	if(place[6] == "P" && (place[17] == ALLOWED_TIMEZONE || ALLOWED_TIMEZONE == "N/A" || ALLOWED_TIMEZONE == ""))
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

FS.writeFileSync(outputFilePath, JSON.stringify(data), "utf8");
