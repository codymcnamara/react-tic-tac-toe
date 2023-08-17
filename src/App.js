import {useState} from 'react';

function Square ({value, onSquareClick}) {  
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i){
    if(squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if( winner ) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  // create 3 rows of 3 squares
  const boardSize = 3;
  let rowsOfSquares = [];
  for (let i = 0; i < boardSize; i++ ){
    let squareEls = [];
    for (let j = 0; j < boardSize; j++ ){
      let index = i * boardSize + j;
      squareEls.push(<Square value={squares[index]} key={index} onSquareClick={() => handleClick(index)} />)
    }
    rowsOfSquares.push(<div className="board-row" key={i}>{squareEls}</div>);
  } 

  return (
    <>
      <div className="status">{status}</div>
      {rowsOfSquares}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  let xIsNext = currentMove % 2 === 0;
   
  function handlePlay(nextSquares) {
    let nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;    
    if (move === currentMove) {
      description = 'You are at move #' + move;
      return (  
        <li key={move}>{description}</li>
      )
    } else if (move > 0 ) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (  
      <li key={move}>
        <button onClick={()=>jumpTo(move)}>{description}</button>
      </li>
    )
  })


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}