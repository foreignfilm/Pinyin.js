
var stars = ['a*', 'e*', 'i*', 'o*', 'u*', 'v*',
            'A*', 'E*', 'I*', 'O*', 'a*i', 'a*o',
            'e*i', 'ia*', 'ia*o', 'ie*', 'io*', 'iu*',
            'A*i', 'A*o', 'E*i', 'o*u', 'ua*', 'ua*i',
            'ue*', 'ui*', 'uo*', 've*', 'O*u'];
            
var nonstars = stars.slice();

for (i=0; i<nonstars.length; i++) {
    nonstars[i] = nonstars[i].replace(/[*]/g, '');
}

var accentsMap = {};

for (i=0; i<stars.length; i++) {
    accentsMap[nonstars[i]] = stars[i];
}


var vowels = ['a*','e*','i*','o*','u*','v*','A*','E*','I*','O*'];

var pinyin = {
    1: ['ā','ē','ī','ō','ū','ǖ','Ā','Ē','Ī','Ō'],
    2: ['á','é','í','ó','ú','ǘ','Á','É','Í','Ó'],
    3: ['ǎ','ě','ǐ','ǒ','ǔ','ǚ','Ǎ','Ě','Ǐ','Ǒ'],
    4: ['à','è','ì','ò','ù','ǜ','À','È','Ì','Ò']
}

pinyinReplace = function(match) {
    
    var toneNumber = match.substr(-1, 1);
    var word = match.substring(0, match.indexOf(toneNumber));
    
    var notFound = true;
    
    for (var val in accentsMap) {
    
        if (word.search(val) != -1) {
            word = word.replace(new RegExp(val), accentsMap[val])
            break;
        }
    }
                
    for (i=0; i<10; i++)
        word = word.replace(vowels[i], pinyin[toneNumber][i]);
        
    return word;
}

$('input').keyup(function(e) {
    
    // Get the pressed key code
    var code = (e.keyCode ? e.keyCode : e.which);
    
    // Do stuff if it’s a space
    if (code == 32 || code == 49 || code == 50 || code == 51 || code == 52) {
    
        // Get the value of the field
        var inputText = $(this).val();
        
        inputText = inputText.replace(/([a-zA-Z]+)([1-5])/g, pinyinReplace);
        
        $(this).val(inputText);
        
    }    
});