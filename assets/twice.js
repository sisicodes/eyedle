class Board {

    static initializeBoard() {
        this.image=document.getElementById('container').style.backgroundImage;
        this.image = "url('assets/images/idols/sana1.jpg')";
        this.container = document.getElementById('container');
        this.container.style.backgroundImage =  "url('assets/images/idols/sana1.jpg')";
        console.log('initialize')

    }
    static createArray() {
        let numberArray = []
        for (let i = 1; i<26; i++) {
            numberArray.push(i);
            console.log(numberArray)
        }
        return numberArray
    }

    static shuffleArray(array) {
        const index = array.indexOf(17); //hardcoded for now
        array.splice(index,1); //opportunity here to protect if it is not found in the array
        let shuffleArray = [];
        let shuffleIndex;
        let shuffleValue;
        for (let i=0; 1<array.length+1; i++) {
            shuffleIndex = Math.floor(Math.random() * array.length);
            shuffleValue = array.splice(shuffleIndex,1);
            shuffleArray.push(shuffleValue[0]);
        };
        return shuffleArray;
    }

    static uncoverEach(loc) {
        const picDiv = document.getElementById(loc.toString());
        picDiv.classList.add('uncovered');

    }

    static uncoverAll() {
        let array = this.createArray();
        this.shuffleArray = this.shuffleArray(array);
        for (const element of this.shuffleArray) {
            setTimeout(this.uncoverEach,1000*(this.shuffleArray.indexOf(element)+1),element)
        };
    }

    static uncoverImm() {
        for (const element of this.shuffleArray) {
            this.uncoverEach(element);
        }
    }
}

class newGame {


    click() {
        this.button.classList.add('none');
        this.clicked = true;
        Board.uncoverAll();
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
        Board.initializeBoard();
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
        this.button = document.getElementById('next')
        this.clicked = false;
        next.addEventListener('click', this.click.bind(this));
    }
}

class Submit {
    constructor() {
        this.submit = document.getElementById('submit');
        submit.addEventListener('click', this.isCorrect.bind(this));
    }

    correctAnswer() {
        stopwatchSingleton.stopTimer();
        console.log('correct answer')
        Board.uncoverImm();
        this.submit.id= 'next';
        this.next = new Next();
    }

    isCorrect() {
        this.answer = document.getElementById('answerText').value;
        this.possible = ['tzuyu', 'mina', 'sana'];
        console.log(Board.image)
        if (this.possible.includes(this.answer.toLowerCase())) {
            console.log('an idol!');
            if (Board.image.includes(this.answer.toLowerCase())) {
                console.log('right answer!');
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
            console.log('in else if')
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
        setTimeout(this.stopTimer.bind(this), 25000);

    }

    stopTimer() {
        clearTimeout(this.on);
        this.on = undefined;
    }

    refreshTimer() {
        this.second = '00';    
        this.centi = '00';
    }


}

ready = new Ready();
submit = new Submit();
stopwatchSingleton = new Stopwatch();