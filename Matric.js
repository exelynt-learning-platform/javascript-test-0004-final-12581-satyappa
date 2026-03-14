let n = 7;

for (let i = 0; i < n; i++) {

    let row = "";

    for (let j = 0; j < n; j++) {

        if (i == 0 || i == 6 || j == 0 || j == 6) {
            row += "4 ";
        }
        else if (i == 1 || i == 5 || j == 1 || j == 5) {
            row += "3 ";
        }
        else if (i == 2 || i == 4 || j == 2 || j == 4) {
            row += "2 ";
        }
        else {
            row += "1 ";
        }

    }

    console.log(row);
}
