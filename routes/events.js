const Router = require('koa-router');
const router = new Router({ prefix: '/events' });
router.get('/', async (ctx) => {
    ctx.body = await getAllEvents();
});
router.post('/filter', async (ctx) => {
    const searchString = ctx.request.body.searchString;
    if (searchString !== undefined && searchString.length > 0) {
        ctx.body = await getAllEvents(searchString);
    } else {
        ctx.body = { "error": "Empty search string." };
    }
});
module.exports = router;