export enum direction {
    BLANK = 0,
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

export interface IGrid {
    collapse: boolean,
    options: Array<number>,
}