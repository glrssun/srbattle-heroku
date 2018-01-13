
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
        console.log('place word '+wordList[i]);
        placeWord(gridSize, wordList[i], grid);
    }

    if (!isOverlapWordExist(grid, gridSize)){
        console.log('check overlapping');
        for(i = 0; i < gridSize; i++){
            for(j = 0; j < gridSize; j++) {
                if(grid[i][j] === '') grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }else {
        createGrid(gridSize, wordList);
    }

    for(i = 0; i < wordList.length; i++){
        console.log("WORD "+wordList[i]);
        if (checkNoDuplicateWord(gridSize, wordList[i], grid) > 1 || checkNoDuplicateWord(gridSize, wordList[i], grid) < 1){
            createGrid(gridSize, wordList);
        }
    }
    return grid;
};

function isOverlapWordExist(grid, gridSize) {
    count = 0;
    for (x = 0; x < gridSize; x++){
        for (y = 0; y < gridSize; y++){
            if (grid[x][y] !== ''){
                if (x - 1 >= 0 && x + 1 < gridSize){
                    if (grid[x + 1][y] !== '' && grid[x - 1][y] === '')
                        count++;
                }
                if (y - 1 >= 0 && y + 1 < gridSize){
                    if (grid[x][y + 1] !== '' && grid[x][y - 1] === '')
                        count++;
                }
                if (x - 1 >= 0 && x + 1 < gridSize && y - 1 >= 0 && y + 1 < gridSize){
                    if (grid[x + 1][y + 1] !== '' && grid[x - 1][y - 1] === '')
                        count++;
                    if (grid[x + 1][y - 1] !== '' && grid[x - 1][y + 1] === '')
                        count++;
                }
            }
        }
    }
    overlap = count < 3;
    return overlap;
}

function checkNoDuplicateWord(gridSize, word, grid){
    word.split('');
    var count = 0;
    /**
    for (var x1 = 0; x1 < gridsize; x1++){
        for (var y1 = 0; y1 < gridsize; y1++){
            for (var x2 = 0; x2 < gridsize; x2++){
                for (var y2 = 0; y2 < gridsize; y2++){
                    if (searchWord(x1, y1, x2, y2, grid, word)){
                        count++;
                    }
                }
            }
        }
    }
     **/
    x = 0; y = 0;
    while (x < gridSize && y < gridSize){
        if (grid[x][y] === word[0]){
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (y + i < gridSize){
                    if (grid[x][y + i] === word[i]){
                        wordToFind = wordToFind + grid[x][y + i];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break;
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (y - i >= 0){
                    if (grid[x][y - i] === word[i]){
                        wordToFind = wordToFind + grid[x][y - i];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (x + i < gridSize){
                    if (grid[x + i][y] === word[i]){
                        wordToFind = wordToFind + grid[x + i][y];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break;
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (x - i >= 0){
                    if (grid[x - i][y] === word[i]){
                        wordToFind = wordToFind + grid[x - i][y];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                }
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (x + i < gridSize && y + i < gridSize){
                    if (grid[x + i][y + i] === word[i]){
                        wordToFind = wordToFind + grid[x + i][y + i];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break;
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (x + i < gridSize && y - i >= 0){
                    if (grid[x + i][y - i] === word[i]){
                        wordToFind = wordToFind + grid[x + i][y - i];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (x - i >= 0 && y + i < gridSize){
                    if (grid[x - i][y + i] === word[i]){
                        wordToFind = wordToFind + grid[x - i][y + i];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break
            }
            wordToFind = '';
            for (i = 0; i < word.length; i++){
                if (x - i >= 0 && y - i >= 0){
                    if (grid[x - i][y - i] === word[i]){
                        wordToFind = wordToFind + grid[x - i][y - i];
                        if (wordToFind === word){
                            count++;
                        }
                    } else break;
                } else break;
            }

        }
        y++;
        if (y >= gridSize){
            x++; y = 0;
        }
    }

    console.log("Count "+count);
    return count;
}


/** Bruteforece Method
function searchWord(x1, y1, x2, y2, grid, word) {
    var wordToFind = '';
    var found = false;
    var valid = false;
    if (x1 < x2 && y1 === y2 && x2 - x1 === word.length-1){
        valid = true;
        for (i = 0; i <= x2 - x1; i++){
            wordToFind += grid[x1+i][y1];
        }
    }else if (x1 > x2 && y1 === y2 && x1 - x2 === word.length - 1){
        valid = true;
        for (i = 0; i <= x1 - x2; i++){
            wordToFind += grid[x1-i][y1];
        }
    }else if (x1 === x2 && y1 < y2 && y2 - y1 === word.length - 1){
        valid = true;
        for (i = 0; i <= y2 - y1; i++){
            wordToFind += grid[x1][y1 + i];
        }
    }else if (x1 === x2 && y1 > y2 && y1 - y2 === word.length - 1){
        valid = true;
        for (i = 0; i <= y1 - y2; i++){
            wordToFind += grid[x1][y1-i];
        }
    }else if (x1 < x2 && y1 < y2 && x2 - x1 === word.length - 1 && y2 - y1 === word.length - 1){
        valid = true;
        for (i = 0; i <= x2 - x1; i++){
            wordToFind += grid[x1+i][y1+i];
        }
    }else if (x1 < x2 && y1 > y2 && x2 - x1 === word.length - 1 && y1 - y2 === word.length - 1){
        valid = true;
        for (i = 0; i <= x2 - x1; i++){
            wordToFind += grid[x1+i][y1-i];
        }
    }else if (x1 > x2 && y1 < y2 && x1 - x2 === word.length - 1 && y2 - y1 === word.length - 1){
        valid = true;
        for (i = 0; i <= x1 - x2; i++){
            wordToFind += grid[x1-i][y1+i];
        }
    }else if (x1 > x2 && y1 > y2 && x1 - x2 === word.length - 1 && y1 - y2 === word.length - 1){
        valid = true;
        for (i = 0; i <= x1 - x2; i++){
            wordToFind += grid[x1-i][y1-i];
        }
    }

    if (!valid) return;

    if (wordToFind === word){
        console.log(wordToFind+'------------'+x1+y1+'   '+x2+y2);
        found = true;
    }
    return found;
}
 **/

function placeWord(gridSize, word, grid) {
    var x = Math.floor(Math.random() * gridSize);
    var y = Math.floor(Math.random() * gridSize);
    if (Math.random() >= 0.5)
        word = word.split('').reverse().join('');

    wordtoPlace = word.split('');
    orientation = orientations[Math.floor(Math.random() * orientations.length)];

    var okPosX = [];
    var okPosY = [];

    if (orientation === 'horizontal' && !( y + word.length > gridSize)) {
        for (var i = 0; i < word.length; i++) {
            if (grid[x][y + i] === '' || grid[x][y + i] === wordtoPlace[i]) {
                okPosX.push(x); okPosY.push(y + i);
            } else {
                placeWord(gridSize, word, grid);
                break;
            }
        }
    } else if (orientation === 'vertical' && !( x + word.length > gridSize)) {
        for (i = 0; i < word.length; i++) {
            if (grid[x + i][y] === '' || grid[x + i][y] === wordtoPlace[i]) {
                okPosX.push(x + i); okPosY.push(y);
            } else {
                placeWord(gridSize, word, grid);
                break;
            }
        }
    } else if (orientation === 'diagonal' && !((x + word.length > gridSize) || (y + word.length > gridSize))) {
        for (i = 0; i < word.length; i++) {
            if (grid[x + i][y + i] === '' || grid[x + i][y + i] === wordtoPlace[i]) {
                okPosX.push(x + i); okPosY.push(y + i);
            } else {
                placeWord(gridSize, word, grid);
                break;
            }
        }
    } else if (orientation === 'diagonalUp' && !((x - word.length < 0) || (y + word.length > gridSize))) {
        for (i = 0; i < word.length; i++) {
            if (grid[x - i][y + i] === '' || grid[x - i][y + i] === wordtoPlace[i]) {
                okPosX.push(x - i); okPosY.push(y + i);
            } else {
                placeWord(gridSize, word, grid);
                break;
            }
        }
    } else {
        placeWord(gridSize, word, grid);
    }

    for (i = 0; i < okPosX.length; i++){
        grid[okPosX[i]][okPosY[i]] = wordtoPlace[i];
    }
}


exports.createGrid = createGrid ;
