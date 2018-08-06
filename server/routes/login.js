

const router = require('koa-router')()

router.prefix('/login')

router.get('/', function (ctx, next) {
    ctx.body = {
        code : 0,
        message : '请用POST方式请求'
    };
})

router.post('/', function(ctx, next){
    console.log(ctx.body);
    ctx.body = {
        code : 0,
        message : '请求成功',
        data : ctx.body
    };
})


module.exports = router
