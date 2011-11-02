// Set up our own object to store the stuff in
function PinyinJs() {

    // Arrays of pīnyīn characters
    this.pinyinChars = {
        1: ['ā','ē','ī','ō','ū','ǖ','Ā','Ē','Ī','Ō'],
        2: ['á','é','í','ó','ú','ǘ','Á','É','Í','Ó'],
        3: ['ǎ','ě','ǐ','ǒ','ǔ','ǚ','Ǎ','Ě','Ǐ','Ǒ'],
        4: ['à','è','ì','ò','ù','ǜ','À','È','Ì','Ò']
    };

    // Toneless pīnyīn vowels
    this.tonelessChars = ['a','e','i','o','u','ü','A','E','I','O'];

    // Asterisks determine the position of the accent in pīnyīn vowel clusters
    this.accentsMap = {
        iao: 'ia*o', uai: 'ua*i',
        ai: 'a*i', ao: 'a*o', ei: 'e*i', ia: 'ia*',  ie: 'ie*',
        io: 'io*', iu: 'iu*', Ai: 'A*i', Ao: 'A*o', Ei: 'E*i',
        ou: 'o*u', ua: 'ua*',  ue: 'ue*', ui: 'ui*', uo: 'uo*',
        ve: 'üe*', Ou: 'O*u', 
        a: 'a*', e: 'e*', i: 'i*', o: 'o*', u: 'u*', v: 'v*',
        A: 'A*', E: 'E*', O: 'O*'
    };

    // Vowels to replace with their accented forms
    this.vowels = ['a*','e*','i*','o*','u*','v*','A*','E*','O*'];

    this.makeObject = false;

    // Convert a numeric pīnyīn string into proper pīnyīn
    // Pass true for the second parameter to return a stuctured object
    this.convert = function(words, makeObject) {

        // Make sure to preserve the scope
        var self = this;

        // The function to convert a single syllable
        var _convert = function(match) {

            // Extract the tone number from the match
            var toneNumber = match.substr(-1, 1);
            
            // Extract just the syllable
            // Given that the toneNumber is a number
            var syllable = (!parseInt(toneNumber)) ? match : match.substring(0, match.indexOf(toneNumber));

            // If it’s zero, bigger than 4, or not a number, treat it as the fifth tone
            // Exit right now
            if (toneNumber == 0 || toneNumber > 4 || !parseInt(toneNumber)) {
                if (makeObject) {
                    return {tone: 5, syllable: syllable, originalSyllable: match};
                }
                else
                    return syllable;
            }
            
            // Put an asterisk inside of the first found vowel cluster
            for (var val in self.accentsMap) {
                if (syllable.search(val) != -1) {
                    syllable = syllable.replace(new RegExp(val), self.accentsMap[val]);
                    break;
                }
            }
          
            // Replace the asterisk’d vowel with an accented character          
            for (i=0; i<10; i++)
                syllable = syllable.replace(self.vowels[i], self.pinyinChars[toneNumber][i]);

            // If asked to create an object, do it
            if (makeObject)
                return {tone: toneNumber, syllable: syllable, originalSyllable: match};
            // Otherwise, just return the toned syllable so it gets replaced
            else
                return syllable;

        };

        // Replace each numeric pinyin syllable in the string with a proper syllable
        if (!makeObject)
            words = words.replace(/([a-zA-ZüÜ]+)(\d)/g, _convert);

        // If asked to make an object:
        else {
            
            // Define the results object array (used if asked)
            var results = [];

            // Insert a space after each tone number in the string, unless the space it’s already there
            words = words.replace(/([a-zA-ZüÜ]+)([\d])([^ ])/g, "$1$2 $3");

            // Split the words string into an array, placing each syllable separately
            var syllables = words.split(' ');

            // Number of syllables
            var syllablesNum = syllables.length;

            // Run the conversion for each one and push the resulting object into the array
            for (j=0; j<syllablesNum; j++)
                results.push(_convert(syllables[j]));

        }

        return (makeObject) ? results : words;
        
    };

    // Extract the tones from each syllable in the string
    // Always returns a structured object
    this.revert = function(syllables) {

        // Split the word into an array, placing each syllable separately
        var syllables = syllables.split(' ');
        var syllablesNum = syllables.length;
    
        // Prepare the array to store the results
        var results = [];

        // For each syllable, loop through each of the pinyin character array sets
        // When an occurence is found, stop and mark down the tone
        for (j=0; j<syllablesNum; j++) {
        
            var foundTone = 0;
            var cleanSyllable = syllables[j];
        
            for (i=1; i<5; i++) {
                if (foundTone == 0) {
                    for (var val in this.pinyinChars[i]) {
                        if (cleanSyllable.search(this.pinyinChars[i][val]) != -1) {
                            cleanSyllable = cleanSyllable.replace(new RegExp(this.pinyinChars[i][val]), this.tonelessChars[val]);
                            foundTone = i;
                            results.push({tone: foundTone, syllable: cleanSyllable, originalSyllable: syllables[j]});
                            break;
                        }
                    }
                }
                else
                    break;
            }
            
            // If the found tone is still zero, assume this word to be toneless (5th tone)
            if (foundTone == 0)
                results.push({tone: 5, syllable: cleanSyllable, originalSyllable: syllables[j]});
            
        }
        
        return results;

    }

}

var pinyinJs = new PinyinJs;
