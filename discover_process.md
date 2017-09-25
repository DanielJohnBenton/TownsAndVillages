## How to run the interesting cluster discovery against a new Geonames dataset

For the purposes of this example, assume ES.txt from Geonames is used (Spain).

### Where to put the Geonames file
Copy `ES.txt` to a relative path `data/geonames`.

### format_places_csv_to_json.js

- Set `COUNTRY_CODE` to the file name's country code e.g `"ES"`
- Set the ALLOWED_TIMEZONE if you want to filter to just one time zone, otherwise set to `"N/A"` or `""`
- Run `node format_places_csv_to_json`

This will create ES.json in the `data/geonames` directory.

### Create a grid

These actions are carried out in the `grid` directory.

#### create_grid.js
- Set `FILE` to the path to the new JSON file e.g. `"../data/geonames/ES.json"`
- Set `REF` to something meaningful e.g. `ES` to determine the name of the output file *Warning*: if you use the same `REF` twice, the first file will be overwritten.
- Set `NX` and `NY` to the number of squares you want in the grid along each axis
- Run `node create_grid`. This will create a JSON file with `REF` in the name

#### test.py
- Set `DATA_FILE` to the location of your Geonames data JSON e.g. `"../data/geonames/ES.json"`
- Set `GRID_FILE` to the location of your new grid file e.g. `"grids/ES.json"`
- Set `FIG_SIZE` to the dimensions for your map - this will take a bit of trial and error. Start with a square and adjust from there
- Run `py test.py`
- If you don't like the grid, you can adjust `create_grid.js` and re-run these steps


#### apply_grid.js
*Warning*: Be careful with this as it will alter your data JSON. If you think a data JSON is compromised, delete it, as it can always be reproduced from the original Geonames file.
- Set `DATA_FILE` to the location of your Geonames data JSON e.g. `"../data/geonames/ES.json"`
- Set `GRID_FILE` to the location of your new grid file e.g. `"grids/ES.json"`
- Run `node apply_grid`

### create_background

- Go to the folder `create_background`
- Update the file path in `create3.js` to the correct data file e.g. `"../data/geonames/ES.json"`
- Run `node create3` *WARNING*: This will overwrite the contents of `_background.csv`
- Copy the new/updated file `_background.csv` into the `background` folder
- Rename the file there to something more meaningful e.g. `ES.csv`

### discover.py
#### Essential tasks
- Ensure `discoveries/graphs` is empty and any previous contents have been copied elsewhere if still needed.

#### Essential settings
- Set `README_INFO` to something informative e.g. `"Spain"`
- Set `DATA_PATH` to the location of the Geonames JSON e.g. `"data/geonames/ES.json"`
- Set `BACKGROUND_PATH` to the location of the background CSV e.g. `"background/ES.csv"`

#### Other settings
- Set the heuristics as desired
- Set FIG_SIZE - if you carefully played with it in `grid/test.py` you may wish to re-use those numbers - however those may have been distorted somewhat by the grid points

#### Run
- Run `py discover.py`
- Graphs should start to appear in `discoveries/graphs`
- If the graphs appear too limited in scope, you may want to loosen up one or more of the heuristics settings