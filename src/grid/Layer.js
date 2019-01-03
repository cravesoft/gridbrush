import React, { Component } from 'react';
import Cell from './Cell';
import TextCell from './TextCell';

class Layer extends Component {
  render() {
    const { name, cellSize, cells, shiftCoord } = this.props;
    if (name === 'lnotes')
      return (
        <g id={name}>
          {cells.map((cell, i) => {
            const xPos = cell.col * cellSize + shiftCoord.x;
            const yPos = cell.row * cellSize + shiftCoord.y;
            return (
              <TextCell
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
    else
      return (
        <g id={name}>
          {cells.map((cell, i) => {
            const xPos = cell.col * cellSize + shiftCoord.x;
            const yPos = cell.row * cellSize + shiftCoord.y;
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
