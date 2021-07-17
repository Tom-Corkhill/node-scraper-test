const cheerio = require('cheerio');
const request = require('request');
const knwl = require('knwl.js');

const knwlInstance = new knwl('english');
knwlInstance.register('internationalPhones', require('./internationalPhones'));

const strInputEmail = 'tim@canddi.com';
const objFinalOutput = {
    arrEmails: [],
    arrAddresses: [],
    arrPhones: []
}

function getDomain(strInputEmail) {
    let strDomain = "https://www." + strInputEmail.split("@")[1];
    return strDomain;
}

function getEmails() {
    let arrFoundEmails = knwlInstance.get('emails');
    if (arrFoundEmails) {
        for (let i = 0; i < arrFoundEmails.length; i++) {
            if (!objFinalOutput.arrEmails.includes(arrFoundEmails[i].address)) {
                objFinalOutput.arrEmails.push(arrFoundEmails[i].address);
            }
        }
    }
}

function getAddresses() {
    let arrFoundAddresses = knwlInstance.get('places');
    console.log(arrFoundAddresses);
}


function getPhones() {
    let arrFoundPhones = knwlInstance.get('internationalPhones');
    if (arrFoundPhones) {
        for (let i = 0; i < arrFoundPhones.length; i++) {
            if(!objFinalOutput.arrPhones.includes(arrFoundPhones[i].phone)) {
                objFinalOutput.arrPhones.push(arrFoundPhones[i].phone);
            }
        }
    }
}


request(getDomain(strInputEmail), (error, response, html) => {
    if(!error && response.statusCode == 200) {
        
        const $ = cheerio.load(html);
        const strHTML = $.html();
        knwlInstance.init($.html());

        getEmails();
        // getAddresses();
        getPhones();

        console.log(objFinalOutput);
    }
});