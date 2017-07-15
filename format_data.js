/*
	Data clean-up notes
	Must fix "Kirkby - In - Ashfield" to be able to split name from details.
*/

"use strict";

let __fs = require("fs");

function ContainsCharacter(str, ch)
{
	for(let i = 0, l = str.length; i < l; i++)
	{
		if(str.charAt(i) == ch)
		{
			return true;
		}
	}
	
	return false;
}

function ContainsString(str, containsThis)
{
	return (str.indexOf(containsThis) != -1);
}

let towns = __fs.readFileSync("towns.txt", "utf8").split("\r\n");

towns = towns.filter(
	function(item)
	{
		return ((item.split(" ").pop().length == 6) && ContainsString(item, " - "));
	}
);

let nTowns = towns.length;

let data = [];

let coordsLookup = [];

for(let i = 0; i < nTowns; i++)
{
	let nameSplit = towns[i].split(" - ");
	let name = nameSplit[0];
	let details = nameSplit[1];
	let alias = "";
	
	if(ContainsCharacter(name, "("))
	{
		let names = name.split(" (");
		
		name = names[0];
		alias = names[1].substr(0, names[1].length - 1);
		
		//console.log(name +" : "+ alias);
	}
	
	let county = "";
	
	for(let iDetails = 0, lDetails = details.length; iDetails < lDetails && !/[0-9]/.test(details.charAt(iDetails)); iDetails++)
	{
		county += details.charAt(iDetails);
	}
	
	details = details.substr(county.length + 1, details.length);
	
	county = county.trim();
	
	details = details.split(" ");
	
	let north = details[0];
	let east = details[1];
	let code = details[2];
	
	north = north.slice(0, -1) - 0;
	east = (east.charAt(east.length - 1) == "W" ? (east.slice(0, -1) - 0) * -1 : (east.slice(0, -1) - 0));
	
	data.push(
		{
			name: name,
			alias: alias,
			county: county,
			north: north,
			east: east,
			code: code
		}
	);
}

__fs.writeFileSync("data.json", JSON.stringify(data), "utf8");