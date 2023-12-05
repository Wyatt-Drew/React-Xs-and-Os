import './Board.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board() {
  return (
    <div className="Board">
      <Square></Square>
      
    </div>

  );
}

export default Board;
