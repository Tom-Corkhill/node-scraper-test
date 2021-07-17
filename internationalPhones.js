/* Phone Number Parser */
function internationalPhones(knwl) {
    
    this.languages = {
        'english': true,
    };
    
    this.calls = function() {
        let results = [];
        let arrWords = knwl.words.get('words');
        let strCurrWord = null;

        let phoneRegexp = /^\d{3,11}$/;
        let countryCodeRegExp = /^\d{1,2}$/;
        let arrRemoveCharacters = ["+", "-", "(", ")", "\"", ",", "\'"];
    
        for (let i = 0; i < arrWords.length; i++) {
            strCurrWord = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i]);
            let isCountryCode = false;
            if (phoneRegexp.test(strCurrWord)) {
                /* At this point the word is thought to be a phone number.
                   If the current word is 11 digits long then it is a complete number
                   If the current word is 10 digits long, we must check for a country code*/
                if (i > 0 && strCurrWord.length === 10) {
                    let strCountryCode = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-1]);
                    if (countryCodeRegExp.test(strCountryCode)) {
                        isCountryCode = true;
                        strCurrWord = strCountryCode + strCurrWord;
                    }
                } else if (i > 1 && strCurrWord.length === 6) {
                    /* If the current word is 6 digits long, it can either have a 5 digit previous word
                       or a 4 digit previous word with a country code before that*/
                    let strPrevWord = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-1]);
                    let strCountryCode = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-2]);
                    if (strPrevWord.length === 5) {
                        strCurrWord = strPrevWord + strCurrWord;
                    } else if ((strPrevWord.length === 4) && (countryCodeRegExp.test(strCountryCode))) {
                        isCountryCode = true;
                        strCurrWord = strCountryCode + strPrevWord + strCurrWord;
                    }
                } else if (i > 2 && ((strCurrWord.length === 4) || (strCurrWord.length === 3))) {
                    /* If the current word is 3 or 4 digits long, it can have multiple previous arrWords
                    made up of 3 or 4 digits, possibly including a country code */
                    let strPrevWord = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-1]);
                    let strSecondPrevWord = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-2]);
                    let strCountryCode = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-3]);
                    if (((strPrevWord.length === 3) || (strPrevWord.length === 4)) && (strSecondPrevWord.length === 3) || (strSecondPrevWord.length === 4)) {
                        if (strCurrWord.length + strPrevWord.length + strSecondPrevWord.length === 11) {
                            strCurrWord = strSecondPrevWord + strPrevWord + strCurrWord;
                        } else if ((strCurrWord.length + strPrevWord.length + strSecondPrevWord.length === 10) && (countryCodeRegExp.test(strCountryCode))) {
                            isCountryCode = true;
                            strCurrWord = strCountryCode + strSecondPrevWord + strPrevWord + strCurrWord;
                        }

                    }
                }

                if ((strCurrWord.length === 11) || (strCurrWord.length === 12)) {
                    if (isCountryCode) {
                        strCurrWord = "+" + strCurrWord;
                    }
                let phoneObj = {
                    phone: strCurrWord,
                    preview: knwl.tasks.preview(i),
                    found: i
                };
                results.push(phoneObj);
                }
            }
        }
        return results;
    };
};

module.exports = internationalPhones;