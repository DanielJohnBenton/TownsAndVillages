"use strict";

let FS = require("fs");

let data = JSON.parse(FS.readFileSync("../data.json", "utf8"));

let output1 = "", output2 = "";

for(let i in data)
{
	output1 += data[i].east +"\t";
	output2 += data[i].north +"\t";
}

let output = output1.trim() +"\n"+ output2.trim();

FS.writeFileSync("templatebg.txt", output, "utf8");