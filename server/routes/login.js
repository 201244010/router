

const router = require('koa-router')();
const utils = require('../utils');

router.prefix('/api/ACCOUNT_LOGIN');

router.get('/', function (ctx, next) {
    ctx.body = {
        code : 0,
        message : '请用POST方式请求'
    };
});

router.post('/', function(ctx, next){
    console.log(ctx.request.body, ctx.request.params);
    let { params } = ctx.request.body; 
    params = params[0];
    if( !params || !params.account.password ){
        return ctx.body = { errcode : 1, message : '参数缺失' };
    }
    let password = params.account.password;
    if(!password){
        return ctx.body = { errcode : 1, message : '密码不能为空' };
    }
    if(password !== utils.base64('123456')){
        return ctx.body = {
            errcode  : -1001,
            message : '密码错误'
        };
    }
    ctx.body = {
        errcode : 0,
        message : '请求成功',
        data : ctx.request.body
    };
})


module.exports = router
