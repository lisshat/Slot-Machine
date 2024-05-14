//1. Deposit some money
//2. Determine number of lines to bet 
//3. Collect bet amount
//4. Spin the slot machine
//5. Determine if user won
//6. Collect winnings
//7. Play again

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = {
    '❤️' : 2,
    '🍎' : 4,
    '🍌' : 6,
    '🍒' : 8
}

const SYMBOL_VALUES = {
    '❤️' : 5,
    '🍎' : 4,
    '🍌' : 3,
    '🍒' : 2

}


const deposit = () => {
    while (true) {
    const depositAmount = prompt('Please deposit money: ');
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log('Please enter a valid amount, Try again!');
        } else {
            return numberDepositAmount;
        }
    }

};

const getNumberOfLines = () => {
    while (true) {
    const lines = prompt('Enter the number of lines to bet on (1-3): ');
    const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log('Invalid number of lines , try again!');
        } else {
            return numberOfLines;
        }
    }

};


const getBet = (balance,lines) => {
    while (true) {
    const betAmount = prompt('Enter your bet per line: ');
    const numberBetAmount = parseFloat(betAmount);

        if (isNaN(numberBetAmount) || numberBetAmount <= 0 || numberBetAmount > (balance / lines)) {
            console.log('Invalid bet amount, try again!');
        } else {
            return numberBetAmount;
        }
    }

};

const spin = () => {
    const symbols = [];

    for(const [symbol,count] of Object.entries(SYMBOLS_COUNT)){
       for(let i=0; i<count; i++){
            symbols.push(symbol);
       }
    } 
    //console.log(symbols);

    const reels = [[]];
    for(let i = 0; i < COLUMNS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for(let j=0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
                reels[i].push(selectedSymbol);
                reelSymbols.splice(randomIndex,1);
        }
    }
     
    return reels;
};

//transposing the reels
const transpose = (reels) => { 
    const rows = [];

    for(let i=0; i<ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLUMNS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (let i = 0; i < ROWS; i++) {
        let rowString = "";
        for (let j = 0; j < COLUMNS; j++) {
            rowString += " " + rows[j][i] + " ";
            if (j !== COLUMNS - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSimilar = true;

        for (let i = 1; i < symbols.length; i++) {
            if (symbols[i] !== symbols[0]) { // Change this line
                allSimilar = false;
                break;
            }
        }

        if (allSimilar) {
            winnings += SYMBOL_VALUES[symbols[0]] * bet;
        }
    }

    return winnings;
}

const game = () => {
 let balance = deposit();

    while(true){
    console.log('Balance: ' + balance.toString());
    const numberOfLines = getNumberOfLines();
    const betAmount = getBet(balance , numberOfLines);
    balance -= betAmount * numberOfLines;
    const reels = spin(); 
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows,betAmount,numberOfLines);
    balance += winnings;
    console.log('You won: ' + winnings.toString());


    if(balance <= 0){
        console.log('You are out of money!');
        break;
    }


    const playAgain = prompt('Do you want to play again? (yes/no): ');

    if(playAgain != "yes")break;
}
};

game();