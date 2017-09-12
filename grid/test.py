from io import StringIO
import json
import pandas
import matplotlib.pyplot as pyplot

DATA_FILE = "../data/geonames/NO.json"
GRID_FILE = "NO.json"
FIG_SIZE = (5,8)

with open(DATA_FILE, encoding="utf8") as data_file:
	data = json.load(data_file)

with open(GRID_FILE, encoding="utf8") as grid_file:
	grid = json.load(grid_file)

#print(grid)

fig = pyplot.figure(figsize=FIG_SIZE)
#pyplot.axis("off")

bgCsvStr = "east,north"
for place in data:
	bgCsvStr +="\n"+ str(place["latitude"]) +","+ str(place["longitude"])
bgCsv = pandas.read_csv(StringIO(bgCsvStr), sep=",")
bgColour = "#e2e2e2"
pyplot.scatter(bgCsv["north"], bgCsv["east"], color=bgColour, s=8)

csvStr = "east,north"
for coord in grid:
	csvStr +="\n"+ str(coord["X >"]) +","+ str(coord["Y >"])
	csvStr +="\n"+ str(coord["X <"]) +","+ str(coord["Y <"])
csv = pandas.read_csv(StringIO(csvStr), sep=",")
#print(csv)
pyplot.scatter(csv["east"], csv["north"], color="black", s=8)

fig.tight_layout()
pyplot.show()