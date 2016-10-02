import { Connection } from '../src/node-tarantool';

describe('node-tarantool', () => {

    it('new Connect()', () => {
        new Connection({
            port: 3301
        });
    });

});