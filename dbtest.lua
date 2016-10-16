local console = require('console')
console.listen('3302')

local DIR = '.testdb'

pcall(
    function ()
        os.execute('mkdir ' .. DIR)
    end
)

box.cfg {
    listen = 3301,
    wal_mode = 'none',
    work_dir = DIR,
}

local test_space = box.space.test
if not test_space then
    test_space = box.schema.space.create('test')
    local primary = test_space:create_index('primary', {
        type = 'tree',
        parts = {1, 'unsigned'},
    })
    for i = 1, 10 do
        test_space:insert({i, i})
    end
end
