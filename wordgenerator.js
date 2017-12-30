
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
    var count = 0;
    var wordSplit = word.split('');
    for (var x = 0; x < gridsize; x++){
        for (var y = 0; y < gridsize; y++){
            for (var i = 0; i < wordSplit.length; i++){
                console.log(" x & y "+x+y+word);
                if ((x + i < gridsize) && (y + i < gridsize) &&(x - i > 0) && (y - i > 0)){
                    if ((grid[x + i][y]) === (wordSplit[i] + i)){
                        count++;
                    }else if ((grid[x - i][y]) === (wordSplit[i] + i)){
                        count++;
                    }else if ((grid[x][y + i]) === (wordSplit[i] + i)){
                        count++;
                    }else if ((grid[x][y - i]) === (wordSplit[i] + i)) {
                        count++;
                    }else if ((grid[x + i][y + i]) === (wordSplit[i] + i)) {
                        count++;
                    }else if ((grid[x + i][y - i]) === (wordSplit[i] + i)) {
                        count++;
                    }else if ((grid[x - i][y - i]) === (wordSplit[i] + i)) {
                        count++;
                    }else if ((grid[x - i][y + i]) === (wordSplit[i] + i)) {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

function placeWord(gridSize, word, grid) {
    var x = Math.floor(Math.random() * gridSize);
    var y = Math.floor(Math.random() * gridSize);

    if (Math.random() >= 0.5)
        word = word.split('').reverse().join('');

    word.split('');
    orientation = orientations[Math.floor(Math.random() * orientations.length)];

    if (word.length !== 0){
        console.log('Word is '+word+' Position y is '+x+' and x is'+y+' while the orientation is +'+orientation);

        if (orientation === 'horizontal' && !( y + word.length > gridSize)) {
            for (var i = 0; i < word.length; i++) {
                if (grid[x][y + i] === '' || grid[x][y + i] === word[i]) {
                    grid[x][y + i] = word[i];
                } else placeWord(gridSize, word, grid);
            }
        } else if (orientation === 'vertical' && !( x + word.length > gridSize)) {
            for (i = 0; i < word.length; i++) {
                if (grid[x + i][y] === '' || grid[x + i][y] === word[i]) {
                    grid[x + i][y] = word[i];
                } else placeWord(gridSize, word, grid);
            }
        } else if (orientation === 'diagonal' && !((x + word.length > gridSize) || (y + word.length > gridSize))) {
            for (i = 0; i < word.length; i++) {
                if (grid[x + i][y + i] === '' || grid[x + i][y + i] === word[i]) {
                    grid[x + i][y + i] = word[i];
                } else placeWord(gridSize, word, grid);
            }
        } else if (orientation === 'diagonalUp' && !((x - word.length < 0) || (y + word.length > gridSize))) {
            for (i = 0; i < word.length; i++) {
                if (grid[x - i][y + i] === '' || grid[x - i][y + i] === word[i]) {
                    grid[x - i][y + i] = word[i];
                } else placeWord(gridSize, word, grid);
            }
        }else{
            placeWord(gridSize, word, grid);
        }
    }
}

exports.createGrid = createGrid ;
