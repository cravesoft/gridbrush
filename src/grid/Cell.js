import React, { PureComponent } from 'react';

class Cell extends PureComponent {
  render() {
    const { index, xPos, yPos, size, content } = this.props;
    const halfSize = size / 2;
    const x0 = xPos + halfSize;
    const y0 = yPos + halfSize;
    if (content === undefined) return null;
    return (
      <g>
        {content.center ? (
          <use
            data-index={index}
            x={xPos}
            y={yPos}
            width={size}
            height={size}
            href={`#${content.center}`}
          />
        ) : (
          [
            content.top ? (
              <use
                key="top"
                data-index={index}
                x={xPos}
                y={yPos - halfSize}
                width={size}
                height={size}
                href={`#${content.top}`}
                style={{
                  transform: 'rotate(90deg)',
                  transformOrigin: `${x0}px ${y0 - halfSize}px`,
                }}
              />
            ) : null,
            content.bottom ? (
              <use
                key="bottom"
                data-index={index}
                x={xPos}
                y={yPos + halfSize}
                width={size}
                height={size}
                href={`#${content.bottom}`}
                style={{
                  transform: 'rotate(90deg)',
                  transformOrigin: `${x0}px ${y0 + halfSize}px`,
                }}
              />
            ) : null,
            content.left ? (
              <use
                key="left"
                data-index={index}
                x={xPos - halfSize}
                y={yPos}
                width={size}
                height={size}
                href={`#${content.left}`}
              />
            ) : null,
            content.right ? (
              <use
                key="right"
                data-index={index}
                x={xPos + halfSize}
                y={yPos}
                width={size}
                height={size}
                href={`#${content.right}`}
              />
            ) : null,
          ]
        )}
      </g>
    );
  }
}

export default Cell;
