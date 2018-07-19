box.cfg{}

box.once('init_test', function()
    box.schema.space.create('test')
    box.space.test:create_index('primary')
end)

function func_select()
    return box.space.test:select()
end

function func_count()
    return box.space.test:count()
end

function func_nil()
    return nil
end