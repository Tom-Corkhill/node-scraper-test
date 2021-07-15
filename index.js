const cheerio = require('cheerio');
const knwl = require('knwl.js');
const request = require('request');

const knwlInstance = new knwl('english');

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



testEmails.forEach(email => {
    request(parseEmails(email), (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            knwlInstance.init($.html());
            let emails = knwlInstance.get('emails');
            let address = knwlInstance.get('places');
            let phone = knwlInstance.get('phones');
            console.log(email + ":", emails, address, phone);
        }
    });
});
