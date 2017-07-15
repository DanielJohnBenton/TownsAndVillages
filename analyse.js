"use strict";

let __fs = require("fs");

let _config = {
	mode: "NGRAMS", // LENGTHS, NGRAMS
	lengths: {
		display: 15
	},
	ngrams: {
		position: "ENDS", // STARTS, ENDS, ENTIRE
		output: "LETTERS-ALPHABETICALLY", // LETTERS-ALPHABETICALLY LETTERS-COUNT
		minimum: 1,
		maximum: 1
	}
};

function Defined(type)
{
	return (type != "undefined");
}

function Undefined(type)
{
	return !Defined(type);
}

function LettersOnly(text)
{
	let letters = "";
	
	for(let i = 0, l = text.length; i < l; i++)
	{
		let ch = text.charAt(i);
		
		if(/[a-zA-Z]/.test(ch))
		{
			letters += ch;
		}
	}
	
	return letters;
}

let data = JSON.parse(__fs.readFileSync("data.json", "utf8"));

if(_config.mode == "LENGTHS")
{
	data.sort(
		function(a, b)
		{
			return (a.name.length - b.name.length);
		}
	);
	
	let shortestTowns = data.slice(0, _config.lengths.display);
	let longestTowns = data.slice(data.length - _config.lengths.display, data.length).reverse();
	
	console.log("SHORTEST:");
	
	for(let i in shortestTowns)
	{
		console.log(" - "+ shortestTowns[i].name);
	}
	
	console.log("LONGEST:");
	
	for(let i in longestTowns)
	{
		console.log(" - "+ longestTowns[i].name);
	}
}
else if(_config.mode == "NGRAMS")
{
	let pieces = [];
	let piecesLookup = [];
	
	for(let size = _config.ngrams.minimum; size <= _config.ngrams.maximum; size++)
	{
		for(let iData = 0, nData = data.length; iData < nData; iData++)
		{
			let letters = LettersOnly(data[iData].name).toUpperCase();
			
			if(letters.length < size)
			{
				continue;
			}
			
			let ngrams = [];
			
			if(_config.ngrams.position == "ENDS")
			{
				ngrams.push(letters.substr(letters.length - size, letters.length));
			}
			else if(_config.ngrams.position == "STARTS")
			{
				ngrams.push(letters.substr(0, size));
			}
			
			for(let iNgrams in ngrams)
			{
				if(Defined(typeof(piecesLookup["_"+ ngrams[iNgrams]])))
				{
					pieces[piecesLookup["_"+ ngrams[iNgrams]]].count++;
				}
				else
				{
					piecesLookup["_"+ ngrams[iNgrams]] = pieces.length;
					
					pieces.push(
						{
							ngram: ngrams[iNgrams],
							count: 1
						}
					);
				}
			}
		}
	}
	
	if(_config.ngrams.output == "LETTERS-ALPHABETICALLY") // min=1 max=1
	{
		let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
		let output = "";
		
		for(let letter in letters)
		{
			output += letters[letter] +"\t";
			
			let found = false;
			for(let iPieces = 0, nPieces = pieces.length; iPieces < nPieces; iPieces++)
			{
				if(pieces[iPieces].ngram == letters[letter])
				{
					output += pieces[iPieces].count +"\n";
					found = true;
					break;
				}
			}
			
			if(!found)
			{
				output +="0\n";
			}
		}
		
		__fs.writeFileSync("output/output_"+ _config.ngrams.position.toLowerCase() +"_letters_alphabetically.txt", output, "utf8");
		
		console.log(pieces);
	}
	else if(_config.ngrams.output == "LETTERS-COUNT") // min=1 max=1
	{
		pieces.sort(
			function(a, b)
			{
				return (b.count - a.count);
			}
		);
		
		let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
		let output = "";
		
		let foundLetters = "";
		
		for(let iPieces = 0, nPieces = pieces.length; iPieces < nPieces; iPieces++)
		{
			foundLetters += pieces[iPieces].ngram;
			
			output += pieces[iPieces].ngram +"\t"+ pieces[iPieces].count +"\n";
		}
		
		for(let letter in letters)
		{
			if(foundLetters.indexOf(letters[letter]) == -1)
			{
				output += letters[letter] +"\t0\n";
			}
		}
		
		__fs.writeFileSync("output/output_"+ _config.ngrams.position.toLowerCase() +"_letters_count.txt", output, "utf8");
		
		console.log(pieces);
	}
}








