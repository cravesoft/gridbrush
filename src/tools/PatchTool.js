import { Component } from 'react';
import Mouse from '../Mouse';

class PatchTool extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  mousedown(buttonPressedCode, x, y, event) {
    this.mousemove(buttonPressedCode, x, y, event);
  }

  mousemove(buttonPressedCode, x, y, event) {
    const col = Math.floor(x / this.props.cellSize);
    const row = Math.floor(y / this.props.cellSize);
    switch (buttonPressedCode) {
      case Mouse.NO_BUTTON:
        this.props.updateDisplayCellContent(col, row, {
          center: this.props.currentBrush,
        });
        break;
      case Mouse.LEFT_BUTTON:
        //TODO uncomment?
        //const pointerType = utils.getPointerType(event.type);
        //const moveEvent =
        //  pointerType === 'touch' ? 'touchmove' : 'mousemove';
        //if (event.type === moveEvent) {
        //  // Don't switch a cell multiple times or cell with the
        //  // same state as the new one changed
        //  const cellIndex = row * utils.getColSize() + col;
        //  if (
        //    this.props.currentIndexChanged.hasOwnProperty(cellIndex) ||
        //    this.props.grid[this.props.currentLayer][cellIndex] ===
        //      this.props.currentBrush
        //  ) {
        //    return;
        //  }
        //  this.props.currentIndexChanged[cellIndex] = true;
        //}
        this.props.updateCellContent(col, row, {
          center: this.props.currentBrush,
        });
        break;
      default:
        break;
    }
  }

  mouseup(buttonPressedCode, x, y, event) {}

  render() {
    return null;
  }
}

export default PatchTool;
