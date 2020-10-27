const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const eventRouter = require('./routes/events');
const app = new Koa();
app.use(bodyParser());
app.use(eventRouter.routes())
app.use(eventRouter.allowedMethods())
app.listen(3000);
console.log('listening on port 3000');

const getUserLocation = (userIP) => {
    return new Promise((resolve, reject) => {
        request({
            url: `${APIs.IpGeoLocation.url}?apiKey=${APIs.IpGeoLocation.APIKey}&ip=${userIP}`,
            rejectUnauthorized: false
        }, (error, response, body) => {
            if (!error && response.statusCode == 200)
                resolve(body);
            else
                return reject(body);
        }
        );
    });
};

