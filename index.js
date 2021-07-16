const cheerio = require('cheerio');
const knwl = require('knwl.js');
const request = require('request');

const knwlInstance = new knwl('english');


const strInputEmail = 'tim@canddi.com/';
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
    } else {
        objFinalOutput.arrEmails.push("No results found");
    }

}

function getPhones(strHTML) {
    const regexValidPhoneNums = /(?<![0-9a-zA-Z])(((\+\d{1,2}(\s|(\(0\)))?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+\d{1,2}\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+\d{1,2}\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?/gm
    let arrFoundPhones = strHTML.match(regexValidPhoneNums);
    if (arrFoundPhones) {
        for (let i = 0; i < arrFoundPhones.length; i++) {
            if(!objFinalOutput.arrPhones.includes(arrFoundPhones[i])) {
                objFinalOutput.arrPhones.push(arrFoundPhones[i]);
            }
        }
    } else {
        objFinalOutput.arrPhones.push("No results found");
    }

}


request(getDomain(strInputEmail), (error, response, html) => {
    if(!error && response.statusCode == 200) {
        
        const $ = cheerio.load(html);
        const strHTML = $.html();
        knwlInstance.init($.html());

        getEmails();          // Uses knwl to parse
        getPhones(strHTML);   // Does not use knwl to parse

        console.log(objFinalOutput);
    }
});