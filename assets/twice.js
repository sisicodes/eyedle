class Board {
    
    static imgList = ["url('assets/images/idols/sana1.jpg')", "url('assets/images/idols/mina1.jpg')", "url('assets/images/idols/tzuyu1.jpg')"];
    static currentImg = this.imgList[0];
    static photoCounter = 0;
    static shuffledArray = [];
    static counter = 0;

    static initializeBoard() {
        this.updatePhoto();
        console.log('initialize')

    }

    static updateBoard () {
        
    };

    static updatePhoto() {
        Board.currentImg = this.imgList[this.photoCounter];
        console.log(`current image: ${Board.currentImg}`)
        Board.container = document.getElementById('container');
        Board.container.style.backgroundImage =  this.currentImg;
        Board.photoCounter++;

    }
    static createArray() {
        let numberArray = []
        for (let i = 1; i<26; i++) {
            numberArray.push(i);
        }
        return numberArray
    }

    static shuffleArray(array) {
        Board.shuffledArray = [];
        let shuffleIndex;
        let shuffleValue;
        for (let i=0; 1<array.length+1; i++) {
            shuffleIndex = Math.floor(Math.random() * array.length);
            shuffleValue = array.splice(shuffleIndex,1);
            Board.shuffledArray.push(shuffleValue[0]);
        };
        return Board.shuffledArray;
    }

    static uncoverEach(loc) {
            const picDiv = document.getElementById(loc.toString());
            picDiv.classList.add('uncovered');
    }

    static recoverAll(loc) {
        const allPicDiv = document.getElementById('container').getElementsByTagName('*');
        Board.cancelUncover();
        for (const element of allPicDiv) {
            element.classList.remove('uncovered');
        };
    };

    static uncoverAll() {
        let array = Board.createArray();
        Board.shuffledArray = Board.shuffleArray(array)
        Board.uncoverEach(Board.shuffledArray[Board.counter])
        Board.counter++;
        Board.un  = setInterval(Board.uncoverAll1,1000);
    }

    static uncoverAll1() {
        Board.uncoverEach(Board.shuffledArray[Board.counter]);
        Board.counter++;
        console.log('in uncover helper');
        if (Board.counter==25) {
            Board.cancelUncover();
        }
    }

    static uncoverImm() {
        for (const element of Board.shuffledArray) {
            this.uncoverEach(element);
        }
        Board.cancelUncover();
    }

    static cancelUncover() {
        clearInterval(Board.un);
    };
}

class newGame {

    click() {
        this.clicked = true;
        Board.uncoverAll();
        stopwatchSingleton.resetTimer();
        stopwatchSingleton.startTimer();
    }

};

class Ready extends newGame {

    constructor() {
        super();
        this.button = document.getElementById('intro');
        this.readyImg = document.getElementById('ready');
        this.clicked = false;

        ready.addEventListener('mouseover', this.hover.bind(this));
        ready.addEventListener('mouseleave', this.unhover.bind(this));
        ready.addEventListener('click', this.click.bind(this));
        ready.addEventListener('click', this.readyClick.bind(this));
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
        next.addEventListener('click', this.nextClick.bind(this));
    }

    nextClick() {
        console.log('next click');
        Board.initializeBoard();
        Board.recoverAll();
        Board.uncoverAll();
        stopwatchSingleton.resetTimer();
        stopwatchSingleton.startTimer();
        this.button.classList.add('hidden');
        submit.submit.classList.remove('hidden');
        submit.input.classList.remove('hidden');
        submit.overlay.classList.remove('won');
    }

    nextDeactivated() {
        next.removeEventListener('click', this.click.bind(this));
    }
}

class Submit {
    constructor() {
        this.submit = document.getElementById('submit');
        submit.addEventListener('click', this.isCorrect.bind(this));
        this.input = document.getElementById('answerText');
        this.overlay = document.getElementById('overlay');
        this.wrongCounter = 0;
    }

    correctAnswer() {
        this.wrongCounter = 0;
        stopwatchSingleton.stopTimer();
        this.overlay.classList.add('right');
        setTimeout(this.restoreColor,200);
        console.log('correct answer')
        Board.uncoverImm();
        next.button.classList.remove('hidden');
        this.input.value = '';
        this.submit.classList.add('hidden');
        this.input.classList.add('hidden');
        setTimeout(this.addBorder,200)

    }

    addBorder() {
        this.overlay.classList.add('won');
    }

    wrongAnswer() {
        this.overlay.classList.add('wrong');
        setTimeout(this.restoreColor,200);
        stopwatchSingleton.penaltyIncrement();
        this.wrongCounter++;
        if (this.wrongCounter ==3) {
            setTimeout(this.wrongFinal.bind(this),200);
        }


    }

    wrongFinal() {
        this.wrongCounter = 0;
        console.log('this is finally wrong');
        this.overlay.classList.add('wrong');
        Board.uncoverImm();
        stopwatchSingleton.stopTimer();
        next.button.classList.remove('hidden');
        //this.input.value = '';
        this.submit.classList.add('hidden');
        this.input.classList.add('hidden');
        
    }

    restoreColor() {
        this.overlay.classList.remove('wrong');
        this.overlay.classList.remove('right');
    }

    isCorrect() {
        this.answer = document.getElementById('answerText').value;
        this.possible = ['tzuyu', 'mina', 'sana'];
        console.log(`current image is ${Board.currentImg}`)
        if (this.possible.includes(this.answer.toLowerCase())) {
            console.log('an idol!');
            if (Board.currentImg.includes(this.answer.toLowerCase())) {
                this.correctAnswer();
            } else {
                this.wrongAnswer();
            }
        } else {
            console.log('not an idol');
            this.wrongAnswer();
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
        this.second = (parseInt(this.second)+10).toString();
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


}

class Photo {
    constructor() {
        this.url = ''
        this.played = false;
        this.won = false;
        this.member = '';
        this.time = null;
        this.penalties = 0;
    }
}

function createPhotoArray() {
    let photoArray = [];
    let i= 0;
    for (const element of Board.imgList) {
        photoArray.push(new Photo());
        photoArray[i].url = element;
        i++;
    }
    return photoArray;
}

ready = new Ready();
submit = new Submit();
next = new Next();
stopwatchSingleton = new Stopwatch();
let photos = createPhotoArray();