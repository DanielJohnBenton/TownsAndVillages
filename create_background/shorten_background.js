"use strict";

let FS = require("fs");

let data = FS.readFileSync("_background.csv", "utf8").split("\n");
data = data.slice(1, data.length);

let N = Math.round(data.length / 2);

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

shuffle(data);

data = data.slice(0, N);

FS.writeFileSync("_background.csv", "east,north\n"+ data.join("\n"));