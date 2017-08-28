# Implementation of analyse.js "COORDINATES" feature with graphing and system args

import sys
from io import StringIO
import json
import pandas
import matplotlib.pyplot as pyplot
from matplotlib.font_manager import FontProperties

foundPosition = False
hasThingsFollowingPosition = False
position = ""
firstNgramIndex = 0

for iArg in range(len(sys.argv)):
	argument = sys.argv[iArg].upper()
	if (not foundPosition) and (argument == "STARTING" or argument == "ENDING" or argument == "CONTAINING"):
		position = argument
		foundPosition = True
	elif foundPosition:
		firstNgramIndex = iArg
		hasThingsFollowingPosition = True
		break

arguments = sys.argv[firstNgramIndex:]

example = "py plot.py starting inver aber"

if not foundPosition:
	print("Please specify at start - starting, ending, or containing")
	print("Example: "+ example)
	quit()
elif not hasThingsFollowingPosition:
	print("Please specify some string(s) to look for which match [A-Za-z\-].")
	print("Example: "+ example)
	quit()

with open('data.json') as data_file:    
    data = json.load(data_file)

fig = pyplot.figure(figsize=(5,8))
pyplot.axis("off")

background = pandas.read_csv("background/_background.csv")
backgroundColour = "#e2e2e2"
pyplot.scatter(background["east"], background["north"], color=backgroundColour, s=8)

coords = {}

for argument in arguments:
	argument = argument.lower()
	coords[argument] = {}
	coords[argument]["north"] = []
	coords[argument]["east"] = []

colours = ["b", "g", "r", "m", "k"]

plots = []

if len(arguments) > len(colours):
	print("Currently only "+ str(len(colours)) +" ngrams are supported per map.")
	quit()

anythingFound = False

for iArg in range(len(arguments)):
	argumentRef = arguments[iArg].lower()
	
	csvData = "north,east"
	
	for place in data:
		name = place["name"].lower()
		
		if len(argumentRef) > len(name):
			continue
		
		if (position == "CONTAINING" and argumentRef in name) or (position == "STARTING" and name.startswith(argumentRef)) or (position == "ENDING" and name.endswith(argumentRef)):
			csvData +="\n"+ str(place["north"]) +","+ str(place["east"])
	
	csv = pandas.read_csv(StringIO(csvData), sep=",")
	plots.append(pyplot.scatter(csv["east"], csv["north"], color=colours[iArg], s=8))
	
	if csvData != "north,east":
		anythingFound = True

font = FontProperties()
font.set_size("small")
legend = pyplot.legend(plots, arguments, loc="upper right", title="Place names "+ position.lower() +":", prop=font, bbox_to_anchor=(0.6, 1.05), ncol=3)

if anythingFound:
	pyplot.show()
else:
	print("Nothing found for that")