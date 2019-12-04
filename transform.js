var request = require('sync-request');
var fs = require('fs');
var Url = require('url-parse');

var filename = './src/app/channels.json';

// var exists = fs.existsSync(filename);
// if (exists)
//     fs.unlinkSync(filename);

var jsonData = JSON.parse(fs.readFileSync('./src/app/channels.json', 'utf-8'))

var start = new Date();
try {
    jsonData.categories.forEach(a => {

        a.channels.forEach(b => {
            console.log(`read ${b.url}`);
            var url = new Url(b.url);
            /*  get location */
            var freegeoulr = `https://freegeoip.app/json/${url.hostname}`;
            try {
                var res = request('GET', freegeoulr, {
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json"
                    },
                });
                var user = JSON.parse(res.getBody('utf8'));

                b.location = user.country_name;
                b.city = user.city || user.time_zone;
            } catch (error) {
                b.location = "unknow";
                b.city = "unknow";
            }

        });

    });

    var millis = Date.now() - start;
    console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);

    jsonData.timestemp = `${start.getDate()}.${start.getMonth() + 1}.${start.getFullYear()} ${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`;

    fs.writeFile(filename, JSON.stringify(jsonData), function(err) {
        if (err) throw err;
        console.log('Saved!');
    });
} catch (error) {
    console.log(error);
}