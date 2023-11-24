import * as p5 from "p5";

import {direction, IGrid} from "./Tp5Project";
import {rules} from "./rules/ruleGrid";

function checkValid(arr: Array<direction>, valid: Array<direction>) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let element = arr[i];
        if (!valid.includes(element)) {
            arr.splice(i, 1);
        }
    }
}

class functional {
    private p: p5;
    private tiles: Array<p5.Image>;
    private width: number = 0;
    private height: number = 0;
    private DIM: number = 0;

    constructor(
        width: number,
        height: number,
        p: p5,
        tiles: Array<p5.Image>,
        dim: number) {
        this.width = width;
        this.height = height;
        this.p = p;
        this.DIM = dim;
        this.tiles = [...tiles];
    }

    get GetWidth(): number {
        return this.width;
    }

    get GetHeight(): number {
        return this.height;
    }

    filterCollapseGrid(allGrid: Array<IGrid>): Array<IGrid> {
        return allGrid.filter((elem: IGrid): boolean => elem.collapse === false);
    }

    drawTile(allGrid: Array<IGrid>) {
        const p: p5 = this.p;
        const DIM: number = this.DIM;
        const width: number = this.width;
        const height: number = this.height;

        allGrid.forEach((elem: IGrid, idxElem: number) => {
            if (elem.collapse === true) {
                let idx = elem.options[0];
                // console.log(idx);
                p.image(
                    this.tiles[idx],
                    (idxElem % DIM) * width,
                    Math.floor(idxElem / DIM) * height,
                    width,
                    height,
                );
                // console.log(idxElem, this.DIM);
                // console.log((idxElem % this.DIM) * width, (idxElem / this.DIM) * height);
            } else {
                p.fill(0);
                p.stroke(255);
                p.rect(
                    (idxElem % DIM) * width,
                    Math.floor(idxElem / DIM) * height,
                    width,
                    height,
                );
            }
        });
    }

    SortArray(pickRandomPick: Array<IGrid>) {
        pickRandomPick.sort((firstElem: IGrid, secondElem: IGrid) => {
            // return firstElem.options.length - secondElem.options.length;
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
    }

    randomPickGrid = (arrayGrid: Array<IGrid>): void => {
        const p = this.p;

        const pickGrid: IGrid = p.random(arrayGrid);
        const pickGridOption: number = p.random(pickGrid.options);

        pickGrid.collapse = true;
        pickGrid.options = [pickGridOption];
    };

    checkAroundGrid(arrayGrid: Array<IGrid>) {
        const DIM = this.DIM;

        return arrayGrid.map((elem: IGrid, index: number, LoopForGrid: Array<IGrid>): IGrid => {
            if (elem.collapse === true) {
                return elem;
            } else if (elem.collapse === false) {

                const row: number = (Math.floor(index / DIM));
                const column: number = index % DIM;
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
                    const up: IGrid = LoopForGrid[column + (row - 1) * DIM];
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
                if (column != DIM - 1) {
                    const right: IGrid = LoopForGrid[row + 1 + column * DIM];
                    let removeOptionsValid: Array<direction> = [];

                    right.options.forEach((elem: number) => {
                        const valid = rules[elem][3];
                        removeOptionsValid = removeOptionsValid.concat(valid);
                    });

                    checkValid(options, removeOptionsValid);
                }

                // loop down
                if (row != DIM - 1) {
                    const down: IGrid = LoopForGrid[column + (row + 1) * DIM];
                    let removeOptionsValid: Array<direction> = [];

                    down.options.forEach((elem: number) => {
                        const valid = rules[elem][0];
                        removeOptionsValid = removeOptionsValid.concat(valid);
                    });

                    checkValid(options, removeOptionsValid);
                }

                // loop left
                if (column != 0) {
                    const left: IGrid = LoopForGrid[column - 1 + row * DIM];
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
    };
}


export {
    checkValid,
    functional
};