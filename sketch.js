const tiles = [];
let grid = [];
const DIM = 10;

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const rules = [
    [
        [BLANK, UP],
        [BLANK, RIGHT],
        [BLANK, DOWN],
        [BLANK, LEFT]
    ],
    [
        [RIGHT, LEFT, DOWN],
        [LEFT, UP, DOWN],
        [BLANK, DOWN],
        [RIGHT, UP, DOWN],
    ],
    [
        [RIGHT, LEFT, DOWN],
        [LEFT, UP, DOWN],
        [RIGHT, LEFT, UP],
        [BLANK, LEFT],
    ],
    [
        [BLANK, UP],
        [LEFT, UP, DOWN],
        [RIGHT, LEFT, UP],
        [RIGHT, UP, DOWN],
    ],
    [
        [RIGHT, LEFT, DOWN],
        [BLANK, RIGHT],
        [RIGHT, LEFT, UP],
        [UP, DOWN, RIGHT],
    ],
];

function checkVaild(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let element = arr[i];
        if (!valid.includes(element)) {
            arr.splice(i, 1);
        }
    }
}

function preload() {
    tiles[0] = loadImage("tiles/demo/blank.png");
    tiles[1] = loadImage("tiles/demo/up.png");
    tiles[2] = loadImage("tiles/demo/right.png");
    tiles[3] = loadImage("tiles/demo/down.png");
    tiles[4] = loadImage("tiles/demo/left.png");
}


function setup() {
    createCanvas(800, 800);

    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = {
            collapse: false,
            options: [BLANK, UP, RIGHT, DOWN, LEFT]
        }
    }
}

function mousePressed() {
    redraw();
}

function draw() {
    background(0);
    const w = width / DIM;
    const h = height / DIM;

    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let cell = grid[i + j * DIM];

            if (cell.collapse === true) {
                let index = cell.options[0];
                image(tiles[index], i * w, j * h, w, h);
            } else {
                fill(0);
                stroke(255);
                rect(i * w, j * h, w, h);
            }
        }
    }

    let gridCopy = grid.slice();
    console.table(grid);
    gridCopy = gridCopy.filter(a => !a.collapse);

    if (gridCopy.length === 0) {
        return;
    }

    gridCopy.sort((a, b) => a.options.length - b.options.length);

    let len = gridCopy[0].options.length;
    let stopIndex = 0;
    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }


    if (stopIndex > 0) {
        gridCopy.splice(stopIndex);
    }

    const cell = random(gridCopy);
    cell.collapse = true;
    const pick = random(cell.options);
    cell.options = [pick];

    const nextGrid = [];

    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let index = i + j * DIM;
            if (grid[index].collapse === true) {
                nextGrid[index] = grid[index];
            } else {
                let options = [BLANK, UP, RIGHT, DOWN, LEFT];

                // loop up
                if (j > 0) {
                    let up = grid[i + (j - 1) * DIM];
                    let validOptions = [];

                    for (let option of up.options) {
                        let valid = rules[option][2];
                        validOptions = validOptions.concat(valid);
                    }
                    checkVaild(options, validOptions);

                }
                if (i < DIM - 1) {
                    let right = grid[i + 1 + j * DIM];
                    let validOptions = [];

                    for (let option of right.options) {
                        let valid = rules[option][3];
                        validOptions = validOptions.concat(valid);
                    }
                    checkVaild(options, validOptions);

                }
                if (j < DIM - 1) {
                    let down = grid[i + (j + 1) * DIM];
                    let validOptions = [];

                    for (let option of down.options) {
                        let valid = rules[option][0];
                        validOptions = validOptions.concat(valid);
                    }
                    checkVaild(options, validOptions);

                }
                if (i > 0) {
                    let left = grid[i - 1 + j * DIM];
                    let validOptions = [];

                    for (let option of left.options) {
                        let valid = rules[option][1];
                        validOptions = validOptions.concat(valid);
                    }
                    checkVaild(options, validOptions);

                }

                nextGrid[index] = {
                    options,
                    collapse: false,
                };

            }
        }
    }

    grid = nextGrid;
    // noLoop();
}