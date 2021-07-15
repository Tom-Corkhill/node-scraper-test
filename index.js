const cheerio = require('cheerio');
const knwl = require('knwl.js');
const request = require('request');


// Email Addresses to be tested
const testEmails = [
    'tim@canddi.com/',
    'johnsmith@showsec.co.uk',
    'janedoe@onvi.com',
    'alexsmith@vauxhall.co.uk'
];

function parseEmails(email) {
    // Split the email and get website to be scraped
    let split = email.split("@")[1];

    // Merge website
    let website = "https://www." + split;
    return website;
}


for (email of testEmails) {
    request(parseEmails(email), (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            console.log(html);
        }
    });
}