import { Component } from 'react';
import Mouse from '../Mouse';

const PixelPosition = {
  TOP_LEFT: 0,
  BOTTOM_LEFT: 1,
  TOP_RIGHT: 2,
  BOTTOM_RIGHT: 3,
};

function getDist(point0, point1) {
  return Math.sqrt(
    Math.pow(point0.a - point1.a, 2) + Math.pow(point0.b - point1.b, 2)
  );
}

function getDistX(point0, point1) {
  return Math.abs(point0.a - point1.a);
}

function getDistY(point0, point1) {
  return Math.abs(point0.b - point1.b);
}

function getPosition(point0, point1, len) {
  const diagLen = len;
  switch (point1.pos) {
    case PixelPosition.TOP_LEFT:
      switch (point0.pos) {
        case PixelPosition.TOP_RIGHT:
          if (getDistX(point0, point1) >= len) return 'top';
          break;
        case PixelPosition.BOTTOM_LEFT:
          if (getDistY(point0, point1) >= len) return 'left';
          break;
        case PixelPosition.BOTTOM_RIGHT:
          if (getDist(point0, point1) >= diagLen) return 'diag1';
          break;
        default:
          break;
      }
      return null;
    case PixelPosition.TOP_RIGHT:
      switch (point0.pos) {
        case PixelPosition.TOP_LEFT:
          if (getDistX(point0, point1) >= len) return 'top';
          break;
        case PixelPosition.BOTTOM_LEFT:
          if (getDist(point0, point1) >= diagLen) return 'diag2';
          break;
        case PixelPosition.BOTTOM_RIGHT:
          if (getDistY(point0, point1) >= len) return 'right';
          break;
        default:
          break;
      }
      return null;
    case PixelPosition.BOTTOM_LEFT:
      switch (point0.pos) {
        case PixelPosition.TOP_LEFT:
          if (getDistY(point0, point1) >= len) return 'left';
          break;
        case PixelPosition.TOP_RIGHT:
          if (getDist(point0, point1) >= diagLen) return 'diag2';
          break;
        case PixelPosition.BOTTOM_RIGHT:
          if (getDistX(point0, point1) >= len) return 'bottom';
          break;
        default:
          break;
      }
      return null;
    case PixelPosition.BOTTOM_RIGHT:
      switch (point0.pos) {
        case PixelPosition.TOP_LEFT:
          if (getDist(point0, point1) >= diagLen) return 'diag1';
          break;
        case PixelPosition.TOP_RIGHT:
          if (getDistY(point0, point1) >= len) return 'right';
          break;
        case PixelPosition.BOTTOM_LEFT:
          if (getDistX(point0, point1) >= len) return 'bottom';
          break;
        default:
          break;
      }
      return null;
    default:
      return null;
  }
}

function getPositionInCell(point, half) {
  if (point.a < half) {
    if (point.b < half) return PixelPosition.TOP_LEFT;
    else return PixelPosition.BOTTOM_LEFT;
  } else {
    if (point.b < half) return PixelPosition.TOP_RIGHT;
    else return PixelPosition.BOTTOM_RIGHT;
  }
}

class BackstitchTool extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.point0 = null;
  }

  mousedown(buttonPressedCode, x, y, event) {
    switch (buttonPressedCode) {
      case Mouse.LEFT_BUTTON:
        const col = Math.floor(x / this.props.cellSize);
        const row = Math.floor(y / this.props.cellSize);
        this.point0 = {
          x,
          y,
          col,
          row,
        };
        break;
      default:
        break;
    }
  }

  mousemove(buttonPressedCode, x, y, event) {
    const col = Math.floor(x / this.props.cellSize);
    const row = Math.floor(y / this.props.cellSize);
    switch (buttonPressedCode) {
      case Mouse.NO_BUTTON:
        this.props.onCoordChange({ col, row });
        break;
      case Mouse.LEFT_BUTTON:
        // return if origin is not set
        if (this.point0 === null) {
          return;
        }

        // project origin onto current cell
        let point0 = {
          a: 0,
          b: 0,
        };
        const cell = {
          x: col * this.props.cellSize,
          y: row * this.props.cellSize,
        };
        if (this.point0.x >= cell.x + this.props.cellSize)
          point0.a = this.props.cellSize;
        else if (this.point0.x >= cell.x)
          point0.a = this.point0.x % this.props.cellSize;
        if (this.point0.y >= cell.y + this.props.cellSize)
          point0.b = this.props.cellSize;
        else if (this.point0.y >= cell.y)
          point0.b = this.point0.y % this.props.cellSize;

        // compute mouse position in current cell
        const point1 = {
          a: x % this.props.cellSize,
          b: y % this.props.cellSize,
        };
        const half = this.props.cellSize / 2;
        point0.pos = getPositionInCell(point0, half);
        point1.pos = getPositionInCell(point1, half);

        // get position of current line piece
        const pos = getPosition(point0, point1, half);
        if (pos === null) return;

        // reset origin
        this.point0 = {
          x,
          y,
          col,
          row,
        };

        // draw line piece
        this.props.updateCellContent(
          col,
          row,
          { [pos]: this.props.currentBrush },
          () => {
            if (pos !== 'diag1' && pos !== 'diag2') {
              // reset neighbor line piece
              let neighborRow = row;
              let neighborCol = col;
              let neighborPos;
              if (pos === 'top') {
                neighborRow--;
                neighborPos = 'bottom';
              } else if (pos === 'bottom') {
                neighborRow++;
                neighborPos = 'top';
              } else if (pos === 'left') {
                neighborCol--;
                neighborPos = 'right';
              } else {
                neighborCol++;
                neighborPos = 'left';
              }
              this.props.updateCellContent(neighborCol, neighborRow, {
                [neighborPos]: undefined,
              });
            }
          }
        );
        break;
      default:
        break;
    }
  }

  mouseup(buttonPressedCode, x, y, event) {
    switch (buttonPressedCode) {
      case Mouse.LEFT_BUTTON:
        // reset the last mouse position
        this.point0 = null;
        break;
      default:
        break;
    }
  }

  render() {
    return null;
  }
}

export default BackstitchTool;
