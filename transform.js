var request = require('sync-request');
var path = require('path');
var fs = require('fs');
var Url = require('url-parse');
var config = "export const categories = [";
var filename = './src/app/channels.ts';
var exists = fs.existsSync(filename);
if (exists)
    fs.unlinkSync(filename);

let contentpolice = '';

let jsonData = JSON.parse(fs.readFileSync('./channels.json', 'utf-8'))
jsonData.categories.forEach(a => {
    if (config != "export const categories = [") {
        config += `,{ \n`;
    } else {
        config += ` \n {\n`;
    }
    config += ` "name":"${a.name}",\n`;
    config += ` "channels":[`;
    a.channels.forEach(b => {
        if ((config.lastIndexOf(':[') + 2) < config.length) {
            config += ",";
        }
        var url = new Url(b.url);
        config += "  {\n";
        config += `     "name":"${b.name}",\n`;
        config += `     'url':'${b.url}',\n`;
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
            config += `     "location":"${user.country_name}",\n`;
            config += `     'city':'${user.city || user.time_zone}',\n`;
            console.log("getBody", user);
        } catch (error) {

        }
        var tu = ` ${url.protocol}//${url.host}/*`;
        if (contentpolice.indexOf(tu) == -1)
            contentpolice += tu;
        config += "  }";
    });
    config += "\n   ]}";
});
config += "];"
contentpolice = `<meta http-equiv="Content-Security-Policy" content="script-src 'self' media-src${contentpolice}">`
fs.writeFile(filename, config, function(err) {
    if (err) throw err;
    console.log('Saved!');
});
var someFile = 'src/index.html';
fs.readFile(someFile, 'utf8', function(err, indexHtml) {
    if (err) {
        return console.log(err);
    }
    var lookfor = '<meta http-equiv="Content-Security-Policy"';
    const start = indexHtml.indexOf(lookfor);
    const end = indexHtml.indexOf('</head>');
    var result = `${indexHtml.slice(0, start)} ${contentpolice} \n ${indexHtml.slice(end)}`
    fs.writeFile(someFile, result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});