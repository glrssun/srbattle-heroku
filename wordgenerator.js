
var orientations = ['horizontal', 'vertical', 'diagonal', 'diagonalUp'];
var letters = 'QWERTYUIOPASDFGHJKLZXCVBNM';

var createGrid = function (gridSize, words) {
    var grid = [];
    var wordList = words;
    for(var i = 0; i < gridSize; i++){
        grid.push([]);
        for(var j = 0; j < gridSize; j++) {
            grid[i].push('');
        }
    }
    for(i = 0; i < wordList.length; i++){
        console.log("try placing word: "+i+" word : "+wordList[i]);
        placeWord(gridSize, wordList[i], grid);
    }

    for(i = 0; i < gridSize; i++){
        for(j = 0; j < gridSize; j++) {
           if(grid[i][j] === '') grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
    }

    for(i = 0; i < wordList.length; i++){
        if (findWord(gridSize, wordList[i], grid) > 1){
            createGrid(gridSize, wordList);
        } else {
            return grid;
        }
    }
};

function findWord(gridsize, word, grid){
    console.log('tis grid'+grid[0].join(''));
    var count = 0;
    wordSplit = word.split('');
    for (var x1 = 0; x1 < gridsize; x1++){
        for (var y1 = 0; y1 < gridsize; y1++){
            for (var x2 = 0; x2 < gridsize; x2++){
                for (var y2 = 0; y2 < gridsize; y2++){
                    if (searchWord(x1, x2, y1, y2, grid, wordSplit) === word){
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

function searchWord(x1, x2, y1, y2, grid, wordSplit) {
    wordToFind = '';
    if (x1 === x2 && y1 < y2 ){
        for (i = 0; i <= y2-y1; i++){
            if (grid[x1][y1+i] === wordSplit[i]) {
                wordToFind += grid[x1][y1 + i];
            }
        }
    }else if (x1 === x2 && y1 > y2){
        for (i = 0; i <= y1-y2; i++){
            if (grid[x1][y1-i] === wordSplit[i]){
                wordToFind += grid[x1][y1-i];
            }
        }
    }else if (x1 < x2 && y1 === y2){
        for (i = 0; i <= x2-x1; i++){
            if (grid[x1+i][y1] === wordSplit[i]){
                wordToFind += grid[x1+i][y1];
            }
        }
    }else if (x1 > x2 && y1 === y2){
        for (i = 0; i <= x1-x2; i++){
            if (grid[x1-i][y1] === wordSplit[i]){
                wordToFind += grid[x1-i][y1];
            }
        }
    }else if (x1 < x2 && y1 < y2){
        for (i = 0; i <= x2-x1; i++){
            if (grid[x1+i][y1+i] === wordSplit[i]){
                wordToFind += grid[x1+i][y1+i];
            }
        }
    }else if (x1 < x2 && y1 > y2){
        for (i = 0; i <= x2-x1; i++){
            if (grid[x1+i][y1-i] === wordSplit[i]){
                wordToFind += grid[x1+i][y1-i];
            }
        }
    }else if (x1 > x2 && y1 < y2){
        for (i = 0; i <= x1-x2; i++){
            if (grid[x1-i][y1+i] === wordSplit[i]){
                wordToFind += grid[x1-i][y1+i];
            }
        }
    }else if (x1 > x2 && y1 > y2){
        for (i = 0; i <= x1-x2; i++){
            if (grid[x1-i][y1-i] === wordSplit[i]){
                wordToFind += grid[x1-i][y1-i];
            }
        }
    }
    return wordToFind;
}

function placeWord(gridSize, word, grid) {
    var x = Math.floor(Math.random() * gridSize);
    var y = Math.floor(Math.random() * gridSize);
    complete = false;

    if (Math.random() >= 0.5)
        word = word.split('').reverse().join('');

    word.split('');
    orientation = orientations[Math.floor(Math.random() * orientations.length)];

    if(word.length !== 0){
        console.log('Word is '+word+' Position y is '+x+' and x is'+y+' while the orientation is +'+orientation);
        if (orientation === 'horizontal' && !( y + word.length > gridSize)) {
            for (var i = 0; i < word.length; i++) {
                if (grid[x][y + i] === '' || grid[x][y + i] === word[i]) {
                    grid[x][y + i] = word[i];
                } else {
                    placeWord(gridSize, word, grid);
                    break;
                }
            }
        } else if (orientation === 'vertical' && !( x + word.length > gridSize)) {
            for (i = 0; i < word.length; i++) {
                if (grid[x + i][y] === '' || grid[x + i][y] === word[i]) {
                    grid[x + i][y] = word[i];
                } else {
                    placeWord(gridSize, word, grid);
                    break;
                }
            }
        } else if (orientation === 'diagonal' && !((x + word.length > gridSize) || (y + word.length > gridSize))) {
            for (i = 0; i < word.length; i++) {
                if (grid[x + i][y + i] === '' || grid[x + i][y + i] === word[i]) {
                    grid[x + i][y + i] = word[i];
                } else {
                    placeWord(gridSize, word, grid);
                    break;
                }
            }
        } else if (orientation === 'diagonalUp' && !((x - word.length < 0) || (y + word.length > gridSize))) {
            for (i = 0; i < word.length; i++) {
                if (grid[x - i][y + i] === '' || grid[x - i][y + i] === word[i]) {
                    grid[x - i][y + i] = word[i];
                } else {
                    placeWord(gridSize, word, grid);
                    break;
                }
            }
        }else{
            placeWord(gridSize, word, grid);
        }
    }
}


exports.createGrid = createGrid ;
