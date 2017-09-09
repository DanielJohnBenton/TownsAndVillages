import sys
from io import StringIO
import json
import pandas
import matplotlib.pyplot as pyplot
from matplotlib.font_manager import FontProperties

foundPosition = False
hasThingsFollowingPosition = False
position = ""
firstArgumentIndex = 0

for iArg in range(len(sys.argv)):
	argument = sys.argv[iArg].upper()
	if (not foundPosition) and (argument == "STARTING" or argument == "ENDING" or argument == "CONTAINING"):
		position = argument
		foundPosition = True
	elif foundPosition:
		firstArgumentIndex = iArg
		hasThingsFollowingPosition = True
		break

arguments = sys.argv[firstArgumentIndex:]

example = "py plot.py starting inver aber"

if not foundPosition:
	print("Please specify at start - starting, ending, or containing")
	print("Example: "+ example)
	quit()
elif not hasThingsFollowingPosition:
	print("Please specify some string(s) to look for which match [A-Za-z\-].")
	print("Example: "+ example)
	quit()

with open("data/geonames/GB_IM_combined.json") as data_file:    
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

# if len(arguments) > 1:
colours = ["b", "y", "r", "w", "k"]
edges   = ["y", "k", "k", "k", "k"]
markers = ["^", "X", "D", "o", "*"]
sizes   = [20,   20,  10,  20,  30]
lines   = [0.3,  0.3, 0.3, 0.3, 0.3]
order = [0, 1, 4, 3, 2]
# else:
	# colours = ["k"]
	# edges = ["w"]
	# markers = ["o"]
	# sizes = [10]
	# lines = [0.3]

plots = []

if len(arguments) > len(order):
	print("Currently only "+ str(len(order)) +" arguments are supported per map.")
	quit()

anythingFound = False
counts = {}

def matches(query, name, position):
	pieces = query.split("!")
	text = pieces[0]
	if (position == "CONTAINING" and text in name) or (position == "STARTING" and name.startswith(text)) or (position == "ENDING" and name.endswith(text)):
		if(len(pieces) > 1):
			for ignore in pieces[1:]:
				if matches(ignore, name, position):
					return False
		return True
	else:
		return False

for iArg in range(len(arguments)):
	argumentRef = arguments[iArg].lower()
	
	counts[argumentRef] = 0
	
	csvData = "east,north"
	
	for place in data:
		name = place["name"].lower()
		
		if len(argumentRef.split("!")[0]) > len(name):
			continue
		
		if matches(argumentRef, name, position):
			csvData +="\n"+ str(place["latitude"]) +","+ str(place["longitude"])
			counts[argumentRef] += 1
	
	csv = pandas.read_csv(StringIO(csvData), sep=",")
	plots.append(pyplot.scatter(csv["north"], csv["east"], facecolors=colours[order[iArg]], edgecolors=edges[order[iArg]], linewidth=lines[order[iArg]], s=sizes[order[iArg]], marker=markers[order[iArg]]))
	
	if csvData != "east,north":
		anythingFound = True


legendArguments = []
for argument in arguments:
	legendArguments.append(argument.split("!")[0])

font = FontProperties()
font.set_size("small")
legend = pyplot.legend(plots, legendArguments, loc="upper right", title="Place names "+ position.lower() +":", prop=font, bbox_to_anchor=(0.6, 1), ncol=3)

fig.tight_layout()

for iArg in range(len(arguments)):
	print("["+ markers[order[iArg]] +"] "+ arguments[iArg] +"\n\t=> "+ str(counts[arguments[iArg].lower()]))

if anythingFound:
	pyplot.show()