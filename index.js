const cheerio = require('cheerio');
const request = require('request');
const knwl = require('knwl.js');

const knwlInstance = new knwl('english');
knwlInstance.register('internationalPhones', require('./internationalPhones'));
knwlInstance.register('postCode', require('./postCode'));

const strInputEmail = 'tim@canddi.com';
const objFinalOutput = {
    arrEmails: [],
    arrAddresses: [],
    arrPhones: []
}

request(getDomain(strInputEmail), (error, response, html) => {
    if(!error && response.statusCode == 200) {
        
        const $ = cheerio.load(html);
        knwlInstance.init($.html());

        getEmails();
        getAddresses();
        getPhones();

        delayLog();
    }
});

function getDomain(strInputEmail) {
    let strDomain = "https://www." + strInputEmail.split("@")[1];
    return strDomain;
}

function getEmails() {
    let arrFoundEmails = knwlInstance.get('emails');
    if (arrFoundEmails) {
        for (let i = 0; i < arrFoundEmails.length; i++) {
            if ((!objFinalOutput.arrEmails.includes(arrFoundEmails[i].address)) && (arrFoundEmails[i].address !== strInputEmail)) {
                objFinalOutput.arrEmails.push(arrFoundEmails[i].address);
            }
        }
    }
}

function getAddresses() {
    let arrFoundAddresses = knwlInstance.get('postCode');

    if (arrFoundAddresses) {
        for (let i = 0; i < arrFoundAddresses.length; i++) {
            let strPostCode = arrFoundAddresses[i].postCode;
            let strPostCodeDomain = "https://checkmypostcode.uk/" + strPostCode;

            // Enters postcode in "checkmypostcode.uk" and returns address
            request(strPostCodeDomain, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    let strAddress = ($('.panel').text().replace(/\s\s+/g, '').match(/.+?(?=[a-zA-z]{1,2}\d{1,2})/)[0]);
                    let strFinalAddress = strAddress + strPostCode;
                    if(!objFinalOutput.arrAddresses.includes(strFinalAddress)) {
                        objFinalOutput.arrAddresses.push(strFinalAddress);
                    }
                }
            });
        }
    }
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

const delayLog = async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1500);
    console.log(objFinalOutput);
  };