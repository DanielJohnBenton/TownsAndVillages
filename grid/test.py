from io import StringIO
import json
import pandas
import matplotlib.pyplot as pyplot

DATA_FILE = "../data/geonames/GB_IM_combined.json"
GRID_FILE = "GB_IM_combined.json"

with open(DATA_FILE) as data_file:
	data = json.load(data_file)

with open(GRID_FILE) as grid_file:
	grid = json.load(grid_file)

#print(grid)

fig = pyplot.figure(figsize=(5,8))
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