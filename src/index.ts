import * as p5 from 'p5';

import P5Project from './modules/p5Project';

const main = (p: p5) => {
    const p5: P5Project = new P5Project();

    p.setup = () => p5.setup();
    p.draw = () => p5.draw();
}

export const myp5: p5 = new p5(main, document.body);