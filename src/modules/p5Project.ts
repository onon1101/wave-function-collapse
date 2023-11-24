import * as p5 from "p5";

import imgBLANK from '../tiles/demo/blank.png';
import imgUP from '../tiles/demo/up.png';
import imgRIGHT from '../tiles/demo/right.png';
import imgDOWN from '../tiles/demo/down.png';
import imgLEFT from '../tiles/demo/left.png';

import {direction, IGrid} from './initConfig';
import {rules} from "./rules/ruleGrid";

function checkValid(arr: Array<direction>, valid: Array<direction>) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let element = arr[i];
        if (!valid.includes(element)) {
            arr.splice(i, 1);
        }
    }
}

export class P5Project {

    private tiles: Array<p5.Image> = [];
    private grid: Array<IGrid|undefined> = [];
    private DIM: number = 0;

    constructor(DIM: number) {
        this.DIM = DIM;

        this.grid = new Array<IGrid>(DIM * DIM).fill(undefined);
        this.grid = this.grid.map((elem) => {
            return {
                collapse: false,
                options:
                    [
                        direction.BLANK,
                        direction.UP,
                        direction.RIGHT,
                        direction.DOWN,
                        direction.LEFT,
                    ],
            }
        });
    }

    public mousePressed(p: p5) {
        p.redraw();
    }

    public preload(p: p5): void {
        this.tiles[0] = p.loadImage(imgBLANK);
        this.tiles[1] = p.loadImage(imgUP);
        this.tiles[2] = p.loadImage(imgRIGHT);
        this.tiles[3] = p.loadImage(imgDOWN);
        this.tiles[4] = p.loadImage(imgLEFT);

    }

    public setup(p: any): void {
        p.createCanvas(400, 400);
        // grid.map((elem) => {
        //     console.log(elem);
        // });
    }

    public draw(p: p5): void {
        p.background(0);

        const width: number = p.width / this.DIM;
        const height: number = p.height / this.DIM;
        // console.log(this.grid);
        let arrayGrid = this.grid;
        // console.log(arrayGrid);

        arrayGrid.map((elem: IGrid, idxElem: number) => {

            if (elem.collapse === true) {
                let idx = elem.options[0];
                // console.log(idx);
                p.image(
                    this.tiles[idx],
                    (idxElem % this.DIM) * width,
                    Math.floor(idxElem / this.DIM) * height,
                    width,
                    height,
                );
                // console.log(idxElem, this.DIM);
                // console.log((idxElem % this.DIM) * width, (idxElem / this.DIM) * height);
            } else {
                p.fill(0);
                p.stroke(255);
                p.rect(
                    (idxElem % this.DIM) * width,
                    Math.floor(idxElem / this.DIM) * height,
                    width,
                    height,
                );
            }
        });


        let pickRandomGrid = arrayGrid.slice();
        // console.table(arrayGrid);

        // 如果已經崩潰，就移除他
        pickRandomGrid = pickRandomGrid.filter(elem => {
                return elem.collapse === false;
            }
        );
        // console.log(pickRandomGrid);
        // 如果不存在為崩潰的磁磚，就停止運算
        if (pickRandomGrid.length === 0) {
            return;
        }

        // 重新排列
        pickRandomGrid.sort((firstElem: IGrid, secondElem: IGrid) => {
            const lengthFirstOptions: number = firstElem.options.length;
            const lengthSecondOptions: number = secondElem.options.length;

            if (lengthFirstOptions < lengthSecondOptions) {
                return -1;
            } else if (lengthFirstOptions > lengthSecondOptions) {
                return 1;
            } else {
                return 0;
            }
        });

        pickRandomGrid.filter((elem: IGrid, idx: number, array: Array<IGrid>) => {
            return elem.options.length <= array[0].options.length;
        });

        // 隨機挑選
        const randomGrid: IGrid = p.random(pickRandomGrid);
        const randomGridOptions: number= p.random(randomGrid.options);

        // 已崩潰
        // pickRandomGrid[6].collapse = true;
        // pickRandomGrid[6].options = [0];
        randomGrid.collapse = true;
        randomGrid.options = [randomGridOptions];
        // console.log(randomGrid, randomGridOptions);

        // console.table(arrayGrid);
        this.grid = arrayGrid.map((elem: IGrid, index: number, LoopForGrid: Array<IGrid>): IGrid => {
            if (elem.collapse === true) {
                return elem;
            } else if (elem.collapse === false) {

                const row: number = (Math.floor(index / this.DIM));
                const column: number = index % this.DIM;
                // console.log(row, column);

                let options: Array<direction> = [
                    direction.BLANK,
                    direction.UP,
                    direction.RIGHT,
                    direction.DOWN,
                    direction.LEFT,
                ];

                // look up
                // 如果不是第一行就檢查
                if (row != 0) {
                    const up: IGrid = LoopForGrid[column + (row - 1) * this.DIM];
                    let removeOptionsValid: Array<direction> = [];

                    up.options.forEach((elem: number) => {
                        const valid = rules[elem][2];
                        // console.log(valid);
                        removeOptionsValid = removeOptionsValid.concat(valid);
                    });

                    // console.log(column + (row - 1) * this.DIM);
                    checkValid(options, removeOptionsValid);
                    // console.log(options);
                }

                // look right
                if (column != this.DIM - 1) {
                    const right: IGrid = LoopForGrid[row + 1 + column * this.DIM];
                    let removeOptionsValid: Array<direction> = [];

                    right.options.forEach((elem: number) => {
                        const valid = rules[elem][3];
                        removeOptionsValid = removeOptionsValid.concat(valid);
                    });

                    checkValid(options, removeOptionsValid);
                }

                // loop down
                if (row != this.DIM - 1) {
                    const down: IGrid = LoopForGrid[column + (row + 1) * this.DIM];
                    let removeOptionsValid: Array<direction> = [];

                    down.options.forEach((elem: number) => {
                        const valid = rules[elem][0];
                        removeOptionsValid = removeOptionsValid.concat(valid);
                    });

                    checkValid(options, removeOptionsValid);
                }

                // loop left
                if (column != 0) {
                    const left: IGrid = LoopForGrid[column - 1 + row * this.DIM];
                    let removeOptionsValid: Array<direction> = [];

                    left.options.forEach((elem: number) => {
                        const valid = rules[elem][1];
                        removeOptionsValid = removeOptionsValid.concat(valid);
                    });

                    checkValid(options, removeOptionsValid);
                }

                return {
                    collapse: false,
                    options,
                };
            }

            return elem;
        });

        console.log(this.grid);
        p.noLoop();
    }
}