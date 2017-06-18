local console = require('console')
console.listen('3302')

local DIR = '.testdb'

pcall(function ()
    os.execute('mkdir ' .. DIR)
end)

box.cfg {
    listen = 3301,
    wal_mode = 'none',
    work_dir = DIR,
}

local function migrate001()
    local space = box.schema.space.create('test')
    space:create_index('primary')

    box.schema.user.grant('guest', 'read,write,execute', 'universe')

    box.schema.user.create('test', { password='test' })
    box.schema.user.grant('test', 'replication')
    box.schema.user.grant('test', 'read,write,execute', 'space', 'test')
end

box.once('001', migrate001)