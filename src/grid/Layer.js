import React, { Component } from 'react';
import Cell from './Cell';

class Layer extends Component {
  render() {
    const { name, cellSize, content } = this.props;
    return (
      <g id={name}>
        {content.map((cell, i) => {
          const xPos = cell.col * cellSize;
          const yPos = cell.row * cellSize;
          return (
            <Cell
              key={i}
              index={i}
              xPos={xPos}
              yPos={yPos}
              size={cellSize}
              content={cell.content}
            />
          );
        })}
      </g>
    );
  }
}

export default Layer;
