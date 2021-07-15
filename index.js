const cheerio = require('cheerio');
const knwl = require('knwl.js');
const request = require('request');


request('https://www.canddi.com/', (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        console.log(html);
    }
})