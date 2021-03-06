var helpers  = require('./libs/helpers'),
    dbClient = require('./database');

module.exports = function (app) {
    /*
        If we request a file directly (e.g. home.html)
        then because we're using the `static` middleware it
        automatically locates the files so we don't need a route
     */

    app.get('/', function (req, res) {
        helpers.loadPage(req, res, 'public/root.html');
    });

    app.get('/test-view', function (req, res) {
        res.render('users', {
            users: [
                { name: 'tobi', email: 'tobi@learnboost.com' },
                { name: 'loki', email: 'loki@learnboost.com' },
                { name: 'jane', email: 'jane@learnboost.com' }
            ],
            title: "EJS example",
            header: "Some users"
        });
    })

    /*
        Any files that don't exist in our static directory can
        still be accessed if we specifically add a route for them
     */

    app.get('/testing.html', function (req, res) {
        helpers.loadPage(req, res, __dirname + req.route.path);
    });

    app.get('/users/:name', function (req, res, next) {
        if (req.params.name === 'mark') {
            res.end('You were after: ' + req.params.name + ', boom!');
        } else {
            next(); // let some other middleware take it if they want it (if no other middleware, for example another `get` call, takes over then the page 404's)
        }
    });

    app.post('/postdata', function (req, res) {
        res.end('Thanks, your full name is "' + req.body.fullname + '" and you are "' + req.body.age + '" years old');
    });

    app.post('/uploadfile', function (req, res) {
        console.log(req.files.fileToUpload);

        // The bodyParser middleware automatically saves the file
        // So we need to make sure that we're not wasting space by saving the same file
        // TODO: compare by hash http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm

        res.end('Thanks for the file');
    });

    app.get('/db', function (req, res) {
        var myCollection = dbClient.collection('myCollection');

        myCollection.insert([{
            some: 'key',
            value: 'pair'
        }], function (err, inserted) { // inserted records
            myCollection.findOne({
                some: 'key'
            }, function (err, result) {
                console.log('result', result); // result.value === 'pair'
            })
        });

        res.end('OK we made it, the terminal should have logged out some content from our DB');
    });

};
