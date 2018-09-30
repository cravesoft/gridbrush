import React, { Component } from 'react';

class TextCell extends Component {
  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  handleMouseOver() {
    let tooltip = document.getElementById('tooltip');
    tooltip.style.top = `${this.props.yPos - 20}px`;
    tooltip.style.left = `${this.props.xPos}px`;
    tooltip.childNodes[0].innerHTML = this.props.text.value;
    tooltip.style.visibility = 'visible';
  }

  handleMouseOut() {
    document.getElementById('tooltip').style.visibility = 'hidden';
  }

  render() {
    const { index, xPos, yPos, size, content, text } = this.props;
    if (content === undefined) return null;
    if (content.center === undefined || content.center === 'eraser')
      return null;
    const y0 = yPos + (size + text.size) / 2;
    const coef = 0.75;
    return (
      <g>
        {text.show ? (
          <text
            data-index={index}
            x={xPos}
            y={y0}
            style={{
              font: `bold ${text.size}px sans-serif`,
              transform: `rotate(${text.rotation}deg)`,
              transformOrigin: `${xPos}px ${y0}px`,
            }}
            fill={`rgb(${text.color.r}, ${text.color.g}, ${text.color.b})`}
            fillOpacity={text.color.a}
          >
            {text.value}
          </text>
        ) : (
          <polygon
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            fill="red"
            points={`${xPos + size * coef},${yPos} ${xPos +
              size},${yPos} ${xPos + size},${yPos + size * (1 - coef)} ${xPos +
              size * coef},${yPos}`}
          />
        )}
      </g>
    );
  }
}

export default TextCell;
