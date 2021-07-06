'use strict'
document.addEventListener('DOMContentLoaded', () => {
    // get the class div
    const grid = document.querySelector('.grid');
    // get all the divs(square) in the grid
    let squares = document.querySelectorAll('.grid div');
    // convert the div squares into an array. Array.from creates an array from an array like or iterable object
    let array_squares = Array.from(squares);
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red', 
        'purple', 
        'green',
        'blue'
    ]



    // console.log(array_squares);
    const lTetrimino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const sTetrimino = [
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1]
    ]

    const tTetrimino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1], 
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetrimino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetrimino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrimino = [lTetrimino, sTetrimino, tTetrimino, oTetrimino, iTetrimino]

    // get random numbers in the array
    let random = Math.floor(Math.random()*theTetrimino.length);

    let currentPosition = 4;
    let currentRotation = 0;
    let current = theTetrimino[random][currentRotation];

    
    console.log(random)

    function draw(){
        current.forEach(index => {
            // add the classname of tetrimino to the divs in the grid. This step colours the tetrimino
            array_squares[currentPosition + index].classList.add('tetrimino');
            array_squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    };

    function undraw(){
        current.forEach(index=> {
            array_squares[currentPosition + index].classList.remove('tetrimino');
            array_squares[currentPosition + index].style.backgroundColor = ''
        })
    };


    function freeze(){
        // if the squares below contains taken, make the squares where the tetriino is locoted have the class of taken
        if(current.some(index=>
            array_squares[currentPosition + index + width].classList.contains('taken')
        )){
            current.forEach(index=> 
                array_squares[currentPosition + index].classList.add('taken'))
                // start a new tetrimino falling
                random = nextRandom
                nextRandom = Math.floor(Math.random()*theTetrimino.length);
                current = theTetrimino[random][currentRotation];
                currentPosition = 4
                draw();
                displayShape();
                addScore();
                gameOver();
        }
    };

    // make the tetrimino move down every second
    function moveDown(){
        undraw();
        currentPosition = currentPosition + width;
        draw();
        freeze()
    };

    // move the tetrimino left, unless it is at the edge or there is blockage
    function moveLeft() {
        undraw();

        const isLeftEdge = current.some(index=> (currentPosition + index) % width === 0);

        if(!isLeftEdge) currentPosition = currentPosition - 1;
        
        if(current.some(index=> array_squares[currentPosition + index].classList.contains('taken'))){
             currentPosition = currentPosition + 1;
        }

        draw()

    };

    // move the tetrimino right, unless it is at the edge or there is a blockage
    function moveRight(){
        undraw();
        const isRightEdge = current.some(index=> (currentPosition+ index) % width === width-1);

        if(!isRightEdge) currentPosition = currentPosition + 1;

        if(current.some(index=> array_squares[currentPosition + index].classList.contains('taken'))){
            currentPosition = currentPosition - 1
        }
        draw()
    };

    function rotate(){
        undraw();
        currentRotation ++
        if(currentRotation === current.length){
            currentRotation = 0;
        }else{
            current = theTetrimino[random][currentRotation]
        }
        draw()

    }
    
    function control(e){
        if(e.keyCode === 37){ 
            moveLeft()
        }else if(e.keyCode ===39){
             moveRight()
        }else if(e.keyCode === 38){
            rotate()
        }else if(e.keyCode === 40){
            moveDown()
        }
    };

    document.addEventListener('keyup', control);

    // show up-next tetrimino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0; //the is the same as the current position ie where the tetrimino will start on the grid

    // this is an array of all tetriminos in their first rotation
    const upNextTetrimino = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetrimino
        [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],  //sTetrimino
        [1, displayWidth, displayWidth+1, displayWidth+2], // tTetrimino
        [0, 1, displayWidth, displayWidth+1], //oTetrimino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetrimino
    ]

    // display the shape in the mini-grid display
    function displayShape(){
        // first of all, we remove any trace of the class tetrimino from the entire mini-grid
        displaySquares.forEach(square => {
            square.classList.remove('tetrimino');
            square.style.backgroundColor = ''
        });

        upNextTetrimino[nextRandom].forEach(index=>{
            displaySquares[displayIndex + index].classList.add('tetrimino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })

    }

    startBtn.addEventListener('click', () => {
        // pause game
        if(timerId){
            clearInterval(timerId)
            timerId = null;
        }else{
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrimino.length);
            displayShape()

        }
    })

    function addScore(){
        // create a row that represents the rows in the grid
        for (let i = 0; i < 199; i+=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            // if a row is 
            if(row.every(index=>array_squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score;
                row.forEach(index=> {
                    array_squares[index].classList.remove('taken');
                    array_squares[index].classList.remove('tetrimino');
                    array_squares[index].style.backgroundColor = ''
                    
                });
                const squaresRemoved = array_squares.splice(i, width)
                array_squares = squaresRemoved.concat(array_squares);
                array_squares.forEach(cells=>grid.appendChild(cells))
        }

    }
    };

    function gameOver(){
        if(current.some(index=>array_squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'GAME OVER!'
            clearInterval(timerId);
            document.removeEventListener('keyup', control);
        }
    }
    



})
