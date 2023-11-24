import {direction} from "../Tp5Project";

// interface directionRules {
//     // BLANK: Array<Array<direction>>;
//     // UP: Array<Array<direction>>;
//     // RIGHT: Array<Array<direction>>;
//     // DOWN: Array<Array<direction>>;
//     // LEFT: Array<Array<direction>>;
// }

export const rules: any = [
    [
        [direction.BLANK, direction.UP],
        [direction.BLANK, direction.RIGHT],
        [direction.BLANK, direction.DOWN],
        [direction.BLANK, direction.LEFT]
    ],
    [
        [direction.RIGHT, direction.LEFT, direction.DOWN],
        [direction.LEFT, direction.UP, direction.DOWN],
        [direction.BLANK, direction.DOWN],
        [direction.RIGHT, direction.UP, direction.DOWN],
    ],
    [
        [direction.RIGHT, direction.LEFT, direction.DOWN],
        [direction.LEFT, direction.UP, direction.DOWN],
        [direction.RIGHT, direction.LEFT, direction.UP],
        [direction.BLANK, direction.LEFT],
    ],
    [
        [direction.BLANK, direction.UP],
        [direction.LEFT, direction.UP, direction.DOWN],
        [direction.RIGHT, direction.LEFT, direction.UP],
        [direction.RIGHT, direction.UP, direction.DOWN],
    ],
    [
        [direction.RIGHT, direction.LEFT, direction.DOWN],
        [direction.BLANK, direction.RIGHT],
        [direction.RIGHT, direction.LEFT, direction.UP],
        [direction.UP, direction.DOWN, direction.RIGHT],
    ],
];