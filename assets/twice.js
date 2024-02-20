//import myJson from './idolData.json' assert {type: 'json'};
//console.log(myJson);

let imgListJson = ["jihyo1.jpg", "mina1.jpg", "sana1.jpg", "tzuyu1.jpg"];
//let imgListJson = ["jihyo1.jpg"];
const membersArray = ['jihyo', 'sana', 'tzuyu']

class Grid {
    static shuffledArray = [];
    static counter = 0;
    static gridSize = 25;
    static oneSec = 1000;
    
    static createArray() {
        let numberArray = []
        for (let i = 1; i<=this.gridSize; i++) {
            numberArray.push(i);
        }
        return numberArray
    }

    static shuffleArray(array) {
        this.shuffledArray = [];
        let shuffleIndex;
        let shuffleValue;
        for (let i=0; 1<array.length+1; i++) {
            shuffleIndex = Math.floor(Math.random() * array.length);
            shuffleValue = array.splice(shuffleIndex,1);
            Grid.shuffledArray.push(shuffleValue[0]);
        };
        return Grid.shuffledArray;
    }

    static uncoverEach(loc) {
            const picDiv = document.getElementById(loc.toString());
            picDiv.classList.add('uncovered');
    }

    static recoverAll(loc) {
        const allPicDiv = document.getElementById('container').getElementsByTagName('*');
        Grid.cancelUncover();
        for (const element of allPicDiv) {
            element.classList.remove('uncovered');
        };
    };

    static uncoverAll() {
        let array = Grid.createArray();
        Grid.shuffledArray = Grid.shuffleArray(array)
        Grid.uncoverEach(Grid.shuffledArray[Grid.counter]) //uncover first before interval
        Grid.counter++;
        Grid.un  = setInterval(Grid.uncoverRest,this.oneSec);
    }

    static uncoverRest() {
        Grid.uncoverEach(Grid.shuffledArray[Grid.counter]);
        Grid.counter++;
        console.log('in uncover helper');
        if (Grid.counter==this.gridSize) {
            Grid.cancelUncover();
        }
    }

    static uncoverImm() {
        for (const element of Grid.shuffledArray) {
            this.uncoverEach(element);
        }
        Grid.cancelUncover();
    }

    static cancelUncover() {
        clearInterval(Grid.un);
    };

};

class Board {
    static currentImg = null;
    static shuffledArray = [];
    static counter = 0;

    static initializeBoard() {
        this.updatePhoto();
    }

    static updateBoard () {
        
    };

    static updatePhoto() {
        Board.currentImg = this.findCurrentPhoto();
        if (Board.currentImg==false) {
            console.log('end of game')
        } else {
            Board.container = document.getElementById('container');
            Board.container.style.backgroundImage = this.currentImg.url;
            Board.currentImg.played = true;
        };

    }

    static findCurrentPhoto() {
        console.log('test')
        for (const photo of photos) {
            console.log(photo);
            if (!photo.played) {
                return photo;
            }
        }
        return false;
    }

  

    static hideBoard() {
        const outroDiv = document.getElementById('outro');
        outroDiv.classList.remove('hidden');
        const mainDiv = document.getElementById('time');
        mainDiv.classList.add('hidden');
        const containerDiv = document.getElementById('container');
        containerDiv.classList.add('hidden');
        const answerDiv = document.getElementById('answer');
        answerDiv.classList.add('hidden');
        Stats.displayStats();
    };
}

class newGame {

    click() {
        if (Board.currentImg != false) {
            //Board.initializeBoard();
            submit.nameDisplay.textContent = '';
            this.clicked = true;
            Grid.uncoverAll();
            stopwatchSingleton.resetTimer();
            stopwatchSingleton.startTimer();
        };
    }

};

class Ready extends newGame {

    constructor() {
        super();
        this.button = document.getElementById('intro');
        this.readyImg = document.getElementById('ready');
        this.clicked = false;

        this.button.addEventListener('mouseover', this.hover.bind(this));
        this.button.addEventListener('mouseleave', this.unhover.bind(this));
        this.button.addEventListener('click', this.click.bind(this));
        this.button.addEventListener('click', this.readyClick.bind(this));
        Board.initializeBoard();
    }

    readyClick() {
        this.button.classList.add('none');
    }

    hover() {
        this.readyImg.src = 'assets/images/icons/ready-to-play-pink.png';
    } 

    unhover() {
        if (!this.clicked) {
            this.readyImg.src = 'assets/images/icons/ready-to-play-black.png';
        };
        
    }

};

class Next extends newGame {
    constructor() {
        super();
        this.clicked = false;
        this.button = document.getElementById('next');
        this.button.addEventListener('click', this.nextClick.bind(this));
        this.button.addEventListener('click', this.click.bind(this));
    }

    nextClick() {
        console.log('next click');
        //submit.nameDisplay.textContent = '';
        Board.initializeBoard();
        submit.restoreColor();
        if (Board.currentImg != false) {
            console.log('this if is working')
            Grid.recoverAll();
            //Board.uncoverAll();
            //stopwatchSingleton.resetTimer();
            //stopwatchSingleton.startTimer();
            this.button.classList.add('hidden');
            submit.submit.classList.remove('hidden');
            submit.input.classList.remove('hidden');
            submit.clearWrongAnswerDisplay();
            //submit.overlay.classList.remove('won');
        } else {
            console.log('this is working')
            Board.hideBoard();
        };
    }

    //nextDeactivated() {
    //    next.removeEventListener('click', this.click.bind(this));
   // }
}

class Submit {
    constructor() {
        this.submit = document.getElementById('submit');
        this.submit.addEventListener('click', this.isCorrect.bind(this));
        this.input = document.getElementById('answerText');
        this.overlay = document.getElementById('overlay');
        this.wrongCounter = 0;
        this.nameDisplay = document.getElementById('name-display');
        this.wrongNameHolder = document.getElementById('wrong-name-holder');
        this.wrongNameDisplay = document.getElementById('wrong-name-display')
    }

    roundOver() {
        this.wrongCounter = 0;
        stopwatchSingleton.stopTimer();
        Grid.uncoverImm();
        Board.currentImg.time = stopwatchSingleton.getTime();
        this.updateCurrentIdolAvg();
        next.button.classList.remove('hidden');
        this.submit.classList.add('hidden');
        this.input.classList.add('hidden');
    }

    correctAnswer() {
        
        this.roundOver();
        this.overlay.classList.add('right');
        this.correctNameDisplay();
        setTimeout(this.restoreColor,200);
        console.log('correct answer')
        Board.currentImg.won = true;
        this.input.value = '';
        setTimeout(this.addBorder,200);

    }

    addBorder() {
        this.overlay.classList.add('won');
    }

    wrongAnswer() {
        this.overlay.classList.add('wrong');
        setTimeout(this.restoreColor,200);
        stopwatchSingleton.penaltyIncrement();
        Board.currentImg.penalties+=1;
        this.wrongCounter++;
        this.input.value = '';
        if (this.wrongCounter ==3) {
            setTimeout(this.wrongFinal.bind(this),200);
        }
    }

    wrongFinal() {
        this.roundOver();
        console.log('this is finally wrong');
        this.overlay.classList.add('wrong');
        Board.currentImg.won = false;       
        this.wrongNameHolder.classList.add('lost'); 
        this.wrongNameHolder.classList.remove('none');
        this.wrongNameDisplay.textContent =Board.currentImg.member.toUpperCase();
    }

    clearWrongAnswerDisplay() {
        this.wrongNameHolder.classList.remove('lost');
        this.wrongNameHolder.classList.add('none');
        this.wrongNameDisplay.textContent = '';
    }

    restoreColor() {
        this.overlay.classList.remove('wrong');
        this.overlay.classList.remove('right');
        this.overlay.classList.remove('won');
    }

    isCorrect() {
        this.answer = this.input.value;
        //this.possible = ['tzuyu', 'mina', 'sana'];
        if (this.answer.toLowerCase() == Board.currentImg.member) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        };
    }

    correctNameDisplay() {
        let name = Board.currentImg.member;
        let upper = name[0].toUpperCase();
        name = upper + name.slice(1);
        this.nameDisplay.textContent = name;
        
    };

    updateCurrentIdolAvg() {
        for (const idol of idols) {
            if (idol.name===Board.currentImg.member) {
                idol.updateAverageTime();
            }
        }
    }
}

class Stopwatch {
    constructor() {
        this.time = document.getElementById('time');
        this.second = this.time.textContent.slice(0,2);
        this.centi = this.time.textContent.slice(3,5);
        this.on = undefined; 
    }

    incrementTime() {
        if (this.centi==='99') {
            this.centi = '00';
            this.second = (parseInt(this.second)+1).toString();
            if (this.second.length ==1) {
                this.second = '0'+this.second;
            }

        } else if (parseInt(this.centi)<99) {
            this.centi = (parseInt(this.centi)+1).toString();
            if (this.centi.length==1) {
                this.centi = '0' +this.centi;
            }
        };
        if (this.second=='50') {
            this.stopTimer();
        }
        this.time.textContent = `${this.second}:${this.centi}`;
        return [this.second,this.centi];
    }

    penaltyIncrement() {
        this.second = (parseInt(this.second)+5).toString();
    }

    startTimer() {
        let i = 1;
        this.on = setInterval(this.incrementTime.bind(this),10);
    }

    stopTimer() {
        clearTimeout(this.on);
        this.on = undefined;
    }

    resetTimer() {
        this.second = '00';    
        this.centi = '00';
    }

    getTime() {
        let timeStr = this.second + '.' + this.centi;
        return parseFloat(timeStr);
    }
}

//organization for multiple photos

class Photo {
    constructor(id) {
        this.id = id;
        this.url = "url('assets/images/idols/" + id + "')";
        this.played = false;
        this.won = false;
        this.member = '';
        this.time = null;
        this.penalties = 0;
    }

    getIdol() {
        const idolMatch = this.id.match(/^(.*?)(?=\d)/);
        this.member = idolMatch[1];

    }
}

class Stats {
    static averageTime;
    
    static getAverageTime() {
        let totalTime = 0
        let playedCards = 0
        for (const photo of photos) {
            playedCards++;
            totalTime += photo.time;
        }
        let average = totalTime/playedCards
        average = average*100;
        average = Math.round(average);
        average = average/100;
        return average;
    }

    static getCardsWon() {
        let wonCards = 0;
        for (const photo of photos) {
            if (photo.won) {
                wonCards++;
            }
        }
        return wonCards;
    }


    static getBestIdol() {
        let minAvg = Infinity;
        let bestIdol = null;
        for (const idol of idols) {
            if (idol.averageTime < minAvg) {
                minAvg = idol.averageTime;
                bestIdol = idol;
            }
        }

        return bestIdol;
    }

    static displayStats() {
        const avgTime = document.getElementById('avg-time');
        const bestIdolEl = document.getElementById('best-idol');
        const numberRight = document.getElementById('number-right');
        avgTime.textContent= this.getAverageTime();
        numberRight.textContent = this.getCardsWon();
        let bestIdol = this.getBestIdol();
        let bestIdolURL = bestIdol.cards[0].url;
        bestIdolEl.style.backgroundImage = bestIdolURL;

    }
}

class Idol {
    constructor(name) {
        this.name = name;
        this.cards = [];
        this.averageTime = null;

    }

    updateAverageTime() {
        let totalTime = 0;
        let playedCards = 0;
        for (const card of this.cards) {
            playedCards++;
            totalTime+=card.time;
        }
        this.averageTime = totalTime/playedCards;
    }
}


function createPhotoArray() {
    let photoArray = [];
    let counter = 0;
    for (const element of imgListJson) {
        photoArray[counter] = new Photo(element);
        photoArray[counter].getIdol();
        counter++;
    }
    return photoArray;
}

function createIdolArray(photoArray) {
    let idolArray = [];
    let idolAdded = false;
    for (const photo of photoArray) {
        for (const idol of idolArray) {
            if (idol.name==photo.member) {
                idol.cards.push(photo);
                idolAdded = true;
            }
        }
        if (!idolAdded) {
            idolArray.push(new Idol(photo.member));
            idolArray[idolArray.length-1].cards.push(photo);
        };

    };
    return idolArray;
};

imgListJson = Grid.shuffleArray(imgListJson);
let photos = createPhotoArray();
let idols = createIdolArray(photos);
let ready = new Ready();
let submit = new Submit();
let next = new Next();
let stopwatchSingleton = new Stopwatch();



// ...your code using `data` here...