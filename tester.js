const pos = require('pos');

function filterWordsByTag(text , targetTag) {
    var words = new pos.Lexer().lex(text);
    var tagger = new pos.Tagger();
    var taggedWords = tagger.tag(words);
    var nouns = "";
    for(let i=0; i<taggedWords.length; i++){
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];
        if(tag === targetTag) {
            nouns = nouns + " " + word;
        }
    }

    console.log('nouns', nouns);
    return nouns;
}

console.log("test", filterWordsByTag("Who is Joe Biden", "NNP"));