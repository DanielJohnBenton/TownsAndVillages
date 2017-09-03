### this script discovers interesting clusters

import sys
import math
from io import StringIO
import json
import pandas
import matplotlib.pyplot as pyplot

## ===
## heuristics - preference given to over-selecting rather than under-selecting
# ngrams below and above these numbers in length of characters will not be considered
NGRAM_MIN = 1
NGRAM_MAX = 20
# if the ngram has at least MIN_POSITIONS, and INTERESTING_PERCENTAGE of them are within MAX_SQUARES, it will be considered interesting
MAX_SQUARES = 7
MIN_POSITIONS = 20
INTERESTING_PERCENTAGE = 70
## ===

# where graphs are saved
GRAPH_PATH = "discoveries/graphs/"

## ===
## load data from JSON and CSV
print("Loading data")

# here are the place names, co-ordinates, and Ordnance Survey grid codes
with open("data.json") as data_file:
	data = json.load(data_file)

# place co-ordinates pre-formatted to be scatter plotted as a grey background/outline of Britain
backgroundData = pandas.read_csv("background/_background.csv")
backgroundColour = "#e2e2e2"
## ===

## ===
## coordinates and square codes are collected per ngram/position combo
print("Preliminary analysis")

ngrams = []
lookup = {}

for size in range(NGRAM_MIN, NGRAM_MAX + 1):
	for place in data:
		name = place["name"]
		
		if len(name) < size:
			continue
		
		square = place["code"][:2]
		
		keys = []
		key_ngrams = []
		
		start_ngram  = name[:size]
		end_ngram = name[-size:]
		
		# starting
		if " " not in start_ngram:
			keys.append("starting_"+ start_ngram.lower())
			key_ngrams.append(start_ngram)
		
		# ending
		if " " not in end_ngram:
			keys.append("ending_"+ end_ngram.lower())
			key_ngrams.append(end_ngram.lower())
		
		# containing
		for char in range(len(name) - (size - 1)):
			ngram = name[char:char + size]
			if " " not in ngram:
				keys.append("containing_"+ ngram.lower())
				key_ngrams.append(ngram.lower())
		
		for iKey in range(len(keys)):
			key = keys[iKey]
			if key in lookup:
				ngrams[lookup[key]]["count"] += 1
				ngrams[lookup[key]]["squares"].append(square)
				ngrams[lookup[key]]["coords"].append({ "north": place["north"], "east": place["east"] })
			else:
				lookup[key] = len(ngrams)
				position = key.split("_")[0]
				ngrams.append({
					"ngram": key_ngrams[iKey],
					"position": position,
					"count": 1,
					"interesting": False,
					"squares": [square],
					"squareCounts": [],
					"interestingSquareCount": 0,
					"coords": [{ "north": place["north"], "east": place["east"] }]
				})

## ===

## ===
## select interesting data according to configured heuristics
print("Selecting interesting data")
ngrams = [ngram for ngram in ngrams if ngram["count"] >= MIN_POSITIONS]

for iNgram in range(len(ngrams)):
	lookup = {}
	for square in ngrams[iNgram]["squares"]:
		if square in lookup:
			ngrams[iNgram]["squareCounts"][lookup[square]] += 1
		else:
			lookup[square] = len(ngrams[iNgram]["squareCounts"])
			ngrams[iNgram]["squareCounts"].append(1)
		
	ngrams[iNgram]["squareCounts"].sort(key=int, reverse=True)
	
	total = 0
	
	for iSquareCount in range(len(ngrams[iNgram]["squareCounts"])):
		if iSquareCount >= MAX_SQUARES:
			break
			
		total += ngrams[iNgram]["squareCounts"][iSquareCount]
		percentage = (total / ngrams[iNgram]["count"]) * 100
		
		if percentage >= INTERESTING_PERCENTAGE:
			ngrams[iNgram]["interesting"] = True
			ngrams[iNgram]["interestingSquareCount"] = iSquareCount + 1
			break

ngrams = [ngram for ngram in ngrams if ngram["interesting"]]
nNgrams = len(ngrams)
## ===

## ===
## sort data for display
print("Sorting data")

# sort for some sort of "interestingness", although this is difficult
ngrams.sort(key=lambda x: (x["interestingSquareCount"] / x["count"], len(x["ngram"]) * -1))

# group identical n-grams together so it is immediately apparent which graph to choose if multiple positions are deemed interesting
# for example, if you have "contains" and "ending", "ending" might be more interesting, but it's harder to keep this in mind for graphs far apart in a list of thousands
lookup_index = {}
for iNgram in range(nNgrams):
	lookup_index[ngrams[iNgram]["position"] +"_"+ ngrams[iNgram]["ngram"].lower()] = iNgram

positions = ["starting", "ending", "containing"]
newNgrams = []

lookup_ngram = {}
for iNgram in range(nNgrams):
	ngram = ngrams[iNgram]
	if ngram["ngram"].lower() not in lookup_ngram:
		newNgrams.append(ngram)
		otherPositions = [position for position in positions if position != ngram["position"]]
		for otherPosition in otherPositions:
			id = otherPosition +"_"+ ngram["ngram"].lower()
			if id in lookup_index:
				newNgrams.append(ngrams[lookup_index[id]])
		lookup_ngram[ngram["ngram"].lower()] = True

ngrams = newNgrams
del newNgrams
## ===

## ===
## Generate graphs as PNGs in the configured folder
print("Generating "+ str(nNgrams) +" graphs")

def progressBar(completed, all, n):
	bars = math.floor((n / all) * completed)
	out = "\r["
	for i in range(bars):
		out +="|"
	for i in range(bars + 1, n):
		out +="-"
	out += "] "+ str(completed)
	sys.stdout.write(out)

for iNgram in range(nNgrams):
	ngram = ngrams[iNgram]
	
	fig = pyplot.figure(figsize=(5,8))
	pyplot.axis("off")
	fig.suptitle("Please names "+ ngram["position"] +" ' "+ ngram["ngram"] +" '")
	
	csvData = "north,east"
	for coord in ngram["coords"]:
		csvData +="\n"+ str(coord["north"]) +","+ str(coord["east"])
	csv = pandas.read_csv(StringIO(csvData), sep=",")
	
	pyplot.scatter(backgroundData["east"], backgroundData["north"], color=backgroundColour, s=8)
	pyplot.scatter(csv["east"], csv["north"], facecolors="b", edgecolors="y", linewidth=0.3, s=20, marker="^")
	fig.tight_layout()
	
	pyplot.savefig(GRAPH_PATH + str(iNgram + 1) +".png")
	pyplot.close(fig)
	
	progressBar(iNgram + 1, nNgrams, 100)
## ===

print("")
print("Done")