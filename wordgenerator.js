

var orientations = ['horizontal', 'vertical', 'diagonal', 'diagonalUp'];
var letters = 'QWERTYUIOPASDFGHJKLZXCVBNM';

exports.createGrid = function (gridSize, words) {
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
        placeword(gridSize, words[i], grid);
    }


    //placeword(gridSize, words[0], grid);
    //placeword(gridSize, words[1], grid);
    //placeword(gridSize, words[2], grid);

    for(i = 0; i < gridSize; i++){
        for(j = 0; j < gridSize; j++) {
           if(grid[i][j] === '') grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
    }
    return grid;
};

var placeword = function (gridSize, word, grid) {
    var x = Math.floor(Math.random() * gridSize);
    var y = Math.floor(Math.random() * gridSize);

    if (Math.random() >= 0.5)
        word = word.split('').reverse().join('');

    word.split('');
    orientation = orientations[Math.floor(Math.random() * orientations.length)];

    console.log('Position x is '+x+' and y is'+y+' while the orientation is +'+orientation);

    if (orientation === 'horizontal' && !( y + word.length > gridSize)) {
        for (var i = 0; i < word.length; i++) {
            if (grid[x][y + i] === '' || grid[x][y + i] === word[i]) {
                grid[x][y + i] = word[i];
            } else placeword(gridSize, word, grid);
        }
    } else if (orientation === 'vertical' && !( x + word.length > gridSize)) {
        for (i = 0; i < word.length; i++) {
            if (grid[x + i][y] === '' || grid[x + i][y] === word[i]) {
                grid[x + i][y] = word[i];
            } else placeword(gridSize, word, grid);
        }
    } else if (orientation === 'diagonal' && !((x + word.length > gridSize) || (y + word.length > gridSize))) {
        for (i = 0; i < word.length; i++) {
            if (grid[x + i][y + i] === '' || grid[x + i][y + i] === word[i]) {
                grid[x + i][y + i] = word[i];
            } else placeword(gridSize, word, grid);
        }
    } else if (orientation === 'diagonalUp' && !((x - word.length < 0) || (y + word.length > gridSize))) {
        for (i = 0; i < word.length; i++) {
            if (grid[x - i][y + i] === '' || grid[x - i][y + i] === word[i]) {
                grid[x - i][y + i] = word[i];
            } else placeword(gridSize, word, grid);
        }
    }else{
        placeword(gridSize, word, grid);
    }
};
