function postCode(knwl) {

    this.languages = {
        'english': true,
    }

    
    this.calls = function() {
        let results = [];
        let arrWords = knwl.words.get('words');
        let strCurrWord = null;

        let postCodeFrontRegEx = /^[a-zA-z]{1,2}\d{1,2}$/;
        let postCodeEndRegEx = /^\d[a-zA-Z]{2}$/;
        let arrRemoveCharacters = ["+", "-", "(", ")", "\"", ",", "\'"];

        for (let i = 0; i < arrWords.length; i++) {
            strCurrWord = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i]);
            if (i > 1 && postCodeEndRegEx.test(strCurrWord)) {
                let strPrevWord = knwl.tasks.removeCharacters(arrRemoveCharacters, arrWords[i-1]);
                if (postCodeFrontRegEx.test(strPrevWord)) {
                    strCurrWord = strPrevWord + strCurrWord;
                    let addressObj = {
                        postCode: strCurrWord,
                        preview: knwl.tasks.preview(i),
                        found: i
                    }
                    results.push(addressObj);
                }
            }
        }
        return results;
    }

}


module.exports = postCode;