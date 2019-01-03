import { Component } from 'react';

class Panning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startCoord: null,
      startShiftCoord: null,
    };
  }

  mousedown(event) {
    this.setState(
      {
        startCoord: {
          x: event.pageX,
          y: event.pageY,
        },
        startShiftCoord: this.props.shiftCoord,
      },
      () => {
        this.props.onChange(true, this.props.shiftCoord);
      }
    );
  }

  mousemove(event) {
    if (this.props.isPanning) {
      this.props.onChange(true, {
        x: this.state.startShiftCoord.x + event.pageX - this.state.startCoord.x,
        y: this.state.startShiftCoord.y + event.pageY - this.state.startCoord.y,
      });
    }
  }

  mouseup(event) {
    this.props.onChange(false, this.props.shiftCoord);
  }

  render() {
    return null;
  }
}

export default Panning;
