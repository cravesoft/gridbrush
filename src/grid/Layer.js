import React, { Component } from 'react';
import Cell from './Cell';

class Layer extends Component {
  render() {
    const { name, cellSize, cells, displacement } = this.props;
    return (
      <g id={name}>
        {cells.map((cell, i) => {
          const xPos = cell.col * cellSize + displacement.x;
          const yPos = cell.row * cellSize + displacement.y;
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
