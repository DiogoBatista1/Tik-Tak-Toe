import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const totalRows = 3;
const squaresPerRow = 3;

function Square(props) {
    return (
        <button
        className={"square " + (props.isWinning ? "square--winning" : null)}
        onClick={props.onClick}>
        {props.value}
        </button>
    )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square 
            isWinning={this.props.winningSquares.includes(i)}
            key={"square " + i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
    );
  }

  renderRow(row) {
    const squares = [];
    const offset = row * squaresPerRow; // this makes sure first row is 0,1,2, second row is 3,4,5, etc.
    for (let s = 0; s < squaresPerRow; s++) {
      squares.push(
        this.renderSquare(offset + s)
      );
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }

  render() {
    const rows = [];
    for (let r = 0; r < totalRows; r++) {
      rows.push(
        this.renderRow(r)
      );
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    };
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: locations[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  sortHistory() {
      this.setState({
          isDescending: !this.state.isDescending
      })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " @ " + history[move].location :
        'Go to game start';
      return (
        <li key={move} className={"historyBtn indBtn" + move}>
          <button onClick={() => this.jumpTo(move)}>
          {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = status = "Winner: " + winner.player;
    } else if (!current.squares.includes(null)) {
        status = "It's a draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } 

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
          <button className="ascendingBtn" onClick={() => this.sortHistory()}>
            Sort by: {this.state.isDescending ? 'Descending' : 'Ascending'}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
        return { player: squares[a], line: [a, b, c] };
      }
  }
  return null;
}
