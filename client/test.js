var TarantoolConnection = require('tarantool-driver');
var conn = new TarantoolConnection({
    port: 3301
});
conn.connect()
    .then(function () {
        //auth for login, password
        return conn.auth('test', 'test');
    }).then(() => {
        // select arguments space_id, index_id, limit, offset, iterator, key
        return conn.select(512, 0, 1, 0, 'eq', [50]);
    })
    .then((results) => {
        doSomeThingWithResults(results);
    });