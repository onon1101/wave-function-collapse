import * as p5 from 'p5';

import * as P5Project from './modules/p5Project';

export const sketch = (p: p5) => {
    const p5: P5Project.P5Project = new P5Project.P5Project(2);

    p.mousePressed = (): void => p5.mousePressed(p);
    p.preload = (): void => p5.preload(p);
    p.setup = (): void => p5.setup(p);
    p.draw = (): void => p5.draw(p);
}

export const myp5: p5 = new p5(sketch, document.body);
