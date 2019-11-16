const path = require('path');
var fs = require('fs');
var Url = require('url-parse');

module.exports = (targetOptions, indexHtml) => {
    /* change head */
    const i = indexHtml.indexOf('</head>');
    let config = '';

    let jsonData = JSON.parse(fs.readFileSync('src/app/channels.json', 'utf-8'))
    jsonData.categories.forEach(a => {
        a.channels.forEach(b => {
            var url = new Url(b.url);
            config += ` ${url.protocol}//${url.host}*`;

        });
    });

    console.log(config);
    config = `<meta http-equiv="Content-Security-Policy" content="media-src ${config}">`
    return `${indexHtml.slice(0, i)}
            ${config}
            ${indexHtml.slice(i)}`
}