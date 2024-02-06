class Board {
    
    static imgList = ["url('assets/images/idols/sana1.jpg')", "url('assets/images/idols/mina1.jpg')", "url('assets/images/idols/tzuyu1.jpg')"];
    static currentImg = this.imgList[0];
    static photoCounter = 0;
    //static keep = true;
    static shuffledArray = [];
    static counter = 0;

    static initializeBoard() {
        //Board.keep = true;
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
        //const index = array.indexOf(17); //hardcoded for now
        //array.splice(index,1); //opportunity here to protect if it is not found in the array
        //let shuffleArray = [];
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
       //Board.keep = true;
        Board.cancelUncover();
        for (const element of allPicDiv) {
            element.classList.remove('uncovered');
        };
    };

    static uncoverAll() {
        let array = Board.createArray();
        Board.shuffledArray = Board.shuffleArray(array)
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
        //this.button.classList.add('none');
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
        //next.addEventListener('click', this.click.bind(this));
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
    }

    correctAnswer() {
        stopwatchSingleton.stopTimer();
        console.log('correct answer')
        Board.uncoverImm();
        next.button.classList.remove('hidden');
        this.input.value = '';
        this.submit.classList.add('hidden');
        this.input.classList.add('hidden');

    }

    isCorrect() {
        this.answer = document.getElementById('answerText').value;
        this.possible = ['tzuyu', 'mina', 'sana'];
        console.log(`current image is ${Board.currentImg}`)
        if (this.possible.includes(this.answer.toLowerCase())) {
            console.log('an idol!');
            if (Board.currentImg.includes(this.answer.toLowerCase())) {
                this.correctAnswer();
            }
        } else {
            console.log('not an idol');
        }
    }

    changeID() {

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
        this.time.textContent = `${this.second}:${this.centi}`;
        return [this.second,this.centi];
    }

    startTimer() {
        console.log('start timer');
        let i = 1;
        this.on = setInterval(this.incrementTime.bind(this),10);
        setTimeout(this.stopTimer.bind(this), 100000);

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

ready = new Ready();
submit = new Submit();
next = new Next();
stopwatchSingleton = new Stopwatch();