import './App.css';
import React from 'react'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    } 
    squares[i] = 'X'
    
    const optimalMove = mostOptimalMove(squares)

    squares[optimalMove] = 'O'

    this.setState({
      history: history.concat([{
      squares: squares,
      }]),
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }



  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const boardValue = calculateBoardValue(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status = 'Choose your next move';

    if(boardValue === 10){
      status = 'X wins'
    } else if(boardValue === -10){
      status = 'O Wins'
    } 
    
    if(isBoardFull(current.squares)){
      status = 'Tie'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function mostOptimalMove(squares){
  let newBoard = squares;
  let optimalMoveVal = Infinity;
  let optimalMove = null;

  for (let i = 0; i < 9; i++){
      if(newBoard[i] === null){
          newBoard[i] = 'O'
          const moveVal = Minimax(newBoard, true, -Infinity, Infinity)
          newBoard[i] = null

          if(moveVal < optimalMoveVal){
              optimalMove = i
              optimalMoveVal = moveVal
          }
      }
  }
  
  return optimalMove
}

function Minimax(board, playerXTurn, alpha, beta){
  let newBoard = board;
  let boardValue = calculateBoardValue(newBoard);

  if(boardValue === 10){
      return boardValue;
  }else if (boardValue === -10){
      return boardValue;
  }

  if (isBoardFull(newBoard)){
      return 0;
  }

  if (playerXTurn){
      let best = -Infinity;
      for(let i = 0; i < 9; i++){
          if(newBoard[i] === null){
              newBoard[i] = 'X'
              best = Math.max(best, Minimax(newBoard, false, alpha, beta))
              alpha = Math.max(best, alpha)
              newBoard[i] = null
              if (alpha >= beta){
                break
              }
          }
      }
     return best
  } else {
      let best = Infinity
      for(let i = 0; i < 9; i++){
          if(newBoard[i] === null){
              newBoard[i] = 'O'
              best = Math.min(best, Minimax(newBoard, true, alpha, beta))
              beta = Math.min(best, beta)
              newBoard[i] = null
              if (alpha >= beta){
                break
              }
          }
      }
      return best
  }
}

function calculateBoardValue(board){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let k = 0; k < lines.length; k++) {
    const [a, b, c] = lines[k];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if (board[a] === 'X'){
          return 10
      }else if (board[b] === 'O'){
          return -10
      }
    }
  }
}

function isBoardFull(board){
  for (let i = 0; i < 9; i++){
      if(board[i] === null){
          return false
      }
  }
  return true
}

export default Game;
