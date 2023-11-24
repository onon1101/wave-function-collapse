import * as p5 from "p5";

import imgBLANK from '../tiles/demo/blank.png';
import imgUP from '../tiles/demo/up.png';
import imgRIGHT from '../tiles/demo/right.png';
import imgDOWN from '../tiles/demo/down.png';
import imgLEFT from '../tiles/demo/left.png';

import {rules} from "./rules/ruleGrid";
import {direction, IGrid} from './Tp5Project';
import {functional} from './functional';

export class P5Project {

    private tiles: Array<p5.Image> = new Array<p5.Image>(5).fill(undefined);
    private grid: Array<IGrid | undefined> = [];
    private DIM: number = 0;

    constructor(DIM: number) {
        this.DIM = DIM;
        this.grid = new Array<IGrid>(DIM * DIM).fill(undefined);
    }

    get GetTile() {
        return this.tiles;
    }

    get GetGrid() {
        return this.grid;
    }

    public mousePressed(p: p5) {
        p.redraw();
    }

    public preload(p: p5): void {
        const loadImgList = [imgBLANK, imgUP, imgRIGHT, imgDOWN, imgLEFT];

        this.grid.forEach((elem: IGrid, idx: number, arr: Array<IGrid>) => {
            arr[idx] = {
                collapse: false,
                options:
                    [
                        direction.BLANK,
                        direction.UP,
                        direction.RIGHT,
                        direction.DOWN,
                        direction.LEFT,
                    ],
            };
        });

        this.tiles.forEach((elem: p5.Image, idx: number, arr: Array<p5.Image>) => {
            arr[idx] = p.loadImage(loadImgList[idx]);
        });
    }

    public setup(p: any): void {
        p.createCanvas(400, 400);
    }

    public draw(p: p5): void {
        p.background(0);

        let arrayGrid = this.grid;

        const TileModule: functional = new functional(
            p.width / this.DIM,
            p.height / this.DIM,
            p,
            this.tiles,
            this.DIM,
        );

        // 對格子畫畫
        TileModule.drawTile(arrayGrid);
        // drawTile(arrayGrid, p, width, height, this.tiles, this.DIM);

        // 如果已經崩潰，就移除他
        let pickRandomGrid = TileModule.filterCollapseGrid([...arrayGrid]);
        // let pickRandomGrid = filterCollapseGrid([...arrayGrid]);

        // 如果不存在為崩潰的磁磚，就停止運算
        if (pickRandomGrid.length === 0) {
            return;
        }

        // 重新排列
        TileModule.SortArray(pickRandomGrid);

        pickRandomGrid = pickRandomGrid.filter((elem: IGrid, idx: number, array: Array<IGrid>) => {
            return elem.options.length <= array[0].options.length;
        });

        TileModule.randomPickGrid(pickRandomGrid);

        this.grid = TileModule.checkAroundGrid(arrayGrid);
        // p.noLoop();
    }
}