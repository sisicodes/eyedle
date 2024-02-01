const ready = document.getElementById('intro');
let clicked = false;

ready.addEventListener('mouseover', (e) => {
    const readyImg = document.getElementById('ready');
    readyImg.src = 'assets/images/icons/ready-to-play-pink.png';

});

ready.addEventListener('mouseleave', (e) => {
    const readyImg = document.getElementById('ready');
    if (!clicked) {
        readyImg.src = 'assets/images/icons/ready-to-play-black.png';
    };
    

});

ready.addEventListener('click', (e) => {
    ready.classList.add('none');
    const readyImg = document.getElementById('ready');
    clicked = true;
    Board.uncoverAll();


});

/*function preShuffle() {
    let numberArray = []
    for (let i = 1; i<26; i++) {
        numberArray.push(i);
        console.log(numberArray)
    }
    return numberArray
}

function shuffle(array) {
    const index = array.indexOf(13); //hardcoded for now
    array.splice(index,1); //opportunity here to protect if it is not found in the array
    let shuffleArray = [];
    let shuffleIndex;
    for (let i=0; 1<array.length+1; i++) {
        shuffleIndex = Math.floor(Math.random() * array.length);
        shuffleValue = array.splice(shuffleIndex,1);
        shuffleArray.push(shuffleValue[0]);
    };
    return shuffleArray;

}

function uncover() {
    let array = preShuffle();
    let shuffleArray = shuffle(array);
    console.log(shuffleArray);
    for (const element of shuffleArray) {
        setTimeout(uncover2,2000*(shuffleArray.indexOf(element)+1),element)
        //uncover2(element);
    };
}

function uncover2(loc) {
    const picDiv = document.getElementById(loc.toString());
    console.log(picDiv);
    picDiv.classList.add('uncovered');
} */

class Board {
    static createArray() {
        let numberArray = []
        for (let i = 1; i<26; i++) {
            numberArray.push(i);
            console.log(numberArray)
        }
        return numberArray
    }

    static shuffleArray(array) {
        const index = array.indexOf(13); //hardcoded for now
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
        console.log(picDiv);
        picDiv.classList.add('uncovered');

    }

    static uncoverAll() {
        let array = this.createArray();
        let shuffleArray = this.shuffleArray(array);
        console.log(shuffleArray);
        for (const element of shuffleArray) {
            setTimeout(this.uncoverEach,1000*(shuffleArray.indexOf(element)+1),element)
        //uncover2(element);
        };
    }
}

