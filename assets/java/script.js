

// return random word from a given list
function returnRandomWord(wordArray) {
    var randomIndex = Math.floor(Math.random()*wordArray.length)

    return wordArray[randomIndex];
}

// return a list of synonyms for thhe parsed word
function getSynonyms(word) {
    var synonymsList = 
    fetch('https://wordsapiv1.p.rapidapi.com/words/'+word+'/synonyms', 
    {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
            'X-RapidAPI-Key': 'API_KEY_HERE'
        }
    })
    .then(response => response.json()) // convert response to json
    .then(data => data.synonyms) // return the list of synonyms
    .catch(err => console.error(err)); // consol log error if any

    return synonymsList;
}

// testing getSynonyms() function
// getSynonyms("book").then(data => console.log(data))