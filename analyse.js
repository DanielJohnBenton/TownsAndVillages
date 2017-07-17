"use strict";

let __fs = require("fs");

let _config = {
	mode: "LENGTHS", // LENGTHS, NGRAMS, COORDINATES
	lengths: {
		display: 15
	},
	ngrams: {
		position: "ENTIRE", // STARTS, ENDS, ENTIRE
		output: "", // [blank], LETTERS-ALPHABETICALLY, LETTERS-COUNT
		minimum: 1,
		maximum: 1
	},
	coordinates: {
		ngram: "regis",
		position: "ENDS", // ENDS, ENTIRE
		copy: true
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
			return (LettersOnly(a.name).length - LettersOnly(b.name).length);
		}
	);
	
	let start = LettersOnly(data[0].name).length;
	let end = LettersOnly(data[data.length - 1].name).length;
	
	let counts = [];
	
	for(let i = 1; i <= end; i++)
	{
		counts["_"+ i] = 0;
	}
	
	for(let i in data)
	{
		counts["_"+ LettersOnly(data[i].name).length]++;
	}
	
	let output = "Length\tCount\n";
	
	for(let i = 1; i <= end; i++)
	{
		output += i +"\t"+ counts["_"+ i] +"\n";
	}
	
	__fs.writeFileSync("output/length_counts.txt", output.trim(), "utf8");
	
	console.log(counts);
	
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
			else if(_config.ngrams.position == "ENTIRE")
			{
				for(let iLetters = 0, xLastLetter = (letters.length - (size - 1)); iLetters < xLastLetter; iLetters++)
				{
					ngrams.push(letters.substr(iLetters, size));
				}
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
	
	if(_config.ngrams.minimum == 1 && _config.ngrams.maximum == 1)
	{
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
	else
	{
		pieces.sort(
			function(a, b)
			{
				return ((b.count - a.count) || (a.ngram.length - b.ngram.length));
			}
		);
		
		let output = "";
		
		for(let piece in pieces)
		{
			output += pieces[piece].ngram +" ("+ pieces[piece].count +")\n";
		}
		
		__fs.writeFileSync("output/output_"+ _config.ngrams.position.toLowerCase() +"_ngrams_"+ _config.ngrams.minimum +"-"+ _config.ngrams.maximum +"_count.txt", output, "utf8");
		
		console.log(pieces.length +" items saved.");
	}
}
else if(_config.mode == "LETTERFREQUENCY")
{
	let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	let counts = [];
	
	for(let letter in alphabet)
	{
		counts["_"+ alphabet[letter]] = 0;
	}
	
	for(let i = 0, n = data.length; i < n; i++)
	{
		let letters = LettersOnly(data[i].name).toLowerCase().split("");
		
		for(let letter in letters)
		{
			counts["_"+ letters[letter]]++;
		}
	}
	
	let total = 0;
	for(let letter in alphabet)
	{
		total += counts["_"+ alphabet[letter]];
	}
	
	let output = "";
	
	for(let letter in alphabet)
	{
		output += alphabet[letter] +"\t"+ ((counts["_"+ alphabet[letter]] / total) * 100) +"%\n";
	}
	
	__fs.writeFileSync("output/letterfrequencies.txt", output, "utf8");
	console.log(output);
}
else if(_config.mode == "COORDINATES")
{
	let filterEnds = function(item)
	{
		let letters = LettersOnly(item.name).toLowerCase();
		
		if(letters.length < _config.coordinates.ngram.length)
		{
			return false;
		}
		
		return (letters.slice(letters.length - _config.coordinates.ngram.length, letters.length) == _config.coordinates.ngram);
	}
	
	let filterEntire = function(item)
	{
		return (LettersOnly(item.name).toLowerCase().indexOf(_config.coordinates.ngram.toLowerCase()) != -1);
	}
	
	let positives = data.filter(
		((_config.coordinates.position == "ENDS") ? filterEnds : filterEntire)
	);
	
	let output = ""
	
	for(let town in positives)
	{
		output += positives[town].east;
		
		if(town < (positives.length - 1))
		{
			output +="\t";
		}
	}
	
	output +="\n";
	
	for(let town in positives)
	{
		output += positives[town].north;
		
		if(town < (positives.length - 1))
		{
			output +="\t";
		}
	}
	
	if(positives.length > 0)
	{
		__fs.writeFileSync("output/coordinates_"+ _config.coordinates.ngram.toLowerCase() +".txt", output, "utf8");
	}
	
	console.log(positives.length +" items saved for '"+ _config.coordinates.ngram.toLowerCase() +"' position: "+ _config.coordinates.position +".");
	
	if(_config.coordinates.copy && positives.length > 0)
	{
		require("clipboardy").writeSync(output);
		
		console.log("Copied to clipboard.");
	}
}	








