"use strict";

let __fs = require("fs");

let data = __fs.readFileSync("output/dictionary_word_occurrences.txt", "utf8").split("\n");

for(let i in data)
{
	data[i] = data[i].split("\t");
}

data = data.filter(
	function(item)
	{
		return (item[0].length >= 3);
	}
);

let output = "";

for(let i in data)
{
	output += data[i][0] +"\t"+ data[i][1] +"\n";
}

__fs.writeFileSync("output/dictionary_word_occurrences_3lettersormore.txt", output, "utf8");
