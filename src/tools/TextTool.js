import React, { Component } from 'react';
import Mouse from '../Mouse';
import utils from '../utils';
import TextModal from '../controls/modals/TextModal';

class TextTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textModalOpen: false,
    };
    this.row = 0;
    this.col = 0;
    this.currentContent = undefined;
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleShowTextModal = this.handleShowTextModal.bind(this);
  }

  mousemove(buttonPressedCode, x, y, event) {
    const col = Math.floor(x / this.props.cellSize);
    const row = Math.floor(y / this.props.cellSize);
    this.props.onCoordChange({ col, row });
  }

  mouseup(buttonPressedCode, x, y, event) {
    const col = Math.floor(x / this.props.cellSize);
    const row = Math.floor(y / this.props.cellSize);
    switch (buttonPressedCode) {
      case Mouse.LEFT_BUTTON:
        if (this.props.currentBrush === 'eraser') {
          this.props.removeCell(col, row);
          return;
        }
        this.col = col;
        this.row = row;
        // find current cell content
        const cellIndex = utils.findCellIndex(this.props.layer, col, row);
        if (cellIndex !== -1) {
          this.currentContent = this.props.layer[cellIndex].content;
        } else {
          this.currentContent = undefined;
        }
        this.handleShowTextModal();
        break;
      default:
        break;
    }
  }

  mousedown(buttonPressedCode, x, y, event) {}

  handleShowTextModal() {
    this.setState(prevState => {
      return { textModalOpen: !prevState.textModalOpen };
    });
  }

  handleFormSubmit(content) {
    content.type = this.props.currentBrush;
    this.props.updateCellContent(this.col, this.row, content);
  }

  render() {
    return (
      <TextModal
        showModal={this.state.textModalOpen}
        onShowTextModal={this.handleShowTextModal}
        currentContent={this.currentContent}
        onSubmit={this.handleFormSubmit}
        modalStyle={this.props.modalStyle}
      />
    );
  }
}

export default TextTool;
