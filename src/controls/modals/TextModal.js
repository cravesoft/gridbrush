import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import config from '../../config/configHandler';
import { Checkbox } from '../inputs/index';
import { SketchPicker } from 'react-color';

export default class TextModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      showText: null,
      textSize: null,
      textColor: null,
      textRotation: null,
      displayColorPicker: false,
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.createOrUpdateTextCell = this.createOrUpdateTextCell.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleRotationChange = this.handleRotationChange.bind(this);
    this.handleShowChange = this.handleShowChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleColorPicker() {
    this.setState(prevState => {
      return { displayColorPicker: !prevState.displayColorPicker };
    });
  }

  handleClickOutside(event) {
    if (
      this.colorPicker &&
      !ReactDOM.findDOMNode(this.colorPicker).contains(event.target)
    ) {
      this.setState(prevState => {
        return { displayColorPicker: !prevState.displayColorPicker };
      });
    }
  }

  handleShowModal() {
    this.setState(
      {
        value: null,
        showText: null,
        textSize: null,
        textColor: null,
        textRotation: null,
      },
      () => {
        this.props.handleShowModal();
      }
    );
  }

  createOrUpdateTextCell(event) {
    event.preventDefault();
    this.props.createOrUpdateTextCell({
      value: this.getTextValue(),
      show: this.getTextShow(),
      size: this.getTextSize(),
      color: this.getTextColor(),
      rotation: this.getTextRotation(),
    });
    this.handleShowModal();
  }

  handleValueChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleShowChange(event) {
    let value;
    this.setState(
      prevState => {
        return (value = { showText: !this.getTextShow() });
      },
      () => {
        config.save(value);
      }
    );
  }

  handleSizeChange(event) {
    let value;
    const size = event.target.value;
    this.setState(
      prevState => {
        return (value = { textSize: size });
      },
      () => {
        config.save(value);
      }
    );
  }

  handleColorChange(color) {
    let value;
    this.setState(
      prevState => {
        return (value = { textColor: color.rgb });
      },
      () => {
        config.save(value);
      }
    );
  }

  handleRotationChange(event) {
    this.setState({
      textRotation: event.target.value,
    });
  }

  getTextValue() {
    return this.state.value
      ? this.state.value
      : this.props.text && this.props.text.value
        ? this.props.text.value
        : '';
  }

  getTextShow() {
    return this.state.showText !== null
      ? this.state.showText
      : this.props.text !== undefined && this.props.text.show != null
        ? this.props.text.show
        : config.get().showText;
  }

  getTextSize() {
    return this.state.textSize
      ? this.state.textSize
      : this.props.text && this.props.text.size
        ? this.props.text.size
        : config.get().textSize;
  }

  getTextColor() {
    return this.state.textColor
      ? this.state.textColor
      : this.props.text && this.props.text.color
        ? this.props.text.color
        : config.get().textColor;
  }

  getTextRotation() {
    return this.state.textRotation
      ? this.state.textRotation
      : this.props.text && this.props.text.rotation
        ? this.props.text.rotation
        : 0;
  }

  getTextColorInHexa() {
    const color = this.getTextColor();
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  getTextColorAlpha() {
    const color = this.getTextColor();
    return color.a;
  }

  render() {
    return (
      <div>
        <ReactModal
          isOpen={this.props.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleShowModal}
          style={this.props.modalStyle}
          className={{
            base: 'modal text-modal',
            afterOpen: 'modal-opened',
            beforeClose: 'modal-closed',
          }}
        >
          {this.state.displayColorPicker ? (
            <div
              style={{
                top: '10px',
                left: '35px',
                position: 'absolute',
                zIndex: '99999',
              }}
            >
              <div
                style={{
                  position: 'fixed',
                  top: '0px',
                  right: '0px',
                  bottom: '0px',
                  left: '0px',
                }}
                onClick={this.handleClose}
              />
              <SketchPicker
                ref={colorPicker => (this.colorPicker = colorPicker)}
                disableAlpha={false}
                color={this.getTextColor()}
                onChange={this.handleColorChange}
              />
            </div>
          ) : (
            ''
          )}
          <h2>Text properties</h2>
          <form onSubmit={this.createOrUpdateTextCell}>
            <p>Write text below.</p>
            <textarea
              value={this.getTextValue()}
              onChange={this.handleValueChange}
            />
            <div className="options-wrapper">
              <ul className="options-list">
                <li />
                <li>
                  <Checkbox
                    id="text-show"
                    label="Show text"
                    isChecked={this.getTextShow()}
                    title="Show the text."
                    handleChange={this.handleShowChange}
                  />
                </li>
                <li>
                  <div className="option">
                    <label htmlFor="font-size" title="Font size">
                      <span className="label-text">Font size</span>
                    </label>
                    <input
                      type="number"
                      id="font-size"
                      className="input-number"
                      value={this.getTextSize()}
                      onChange={this.handleSizeChange}
                    />
                  </div>
                </li>
                <li>
                  <div className="option">
                    <label htmlFor="font-color" title="Font color">
                      <span className="label-text">Font color</span>
                    </label>
                    <div
                      id="font-color"
                      onClick={this.toggleColorPicker}
                      className="font-color"
                      title="Select font color"
                    >
                      <svg
                        version="1.1"
                        baseProfile="full"
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                      >
                        <rect
                          x="0"
                          y="0"
                          width="20"
                          height="20"
                          fill={this.getTextColorInHexa()}
                          fillOpacity={this.getTextColorAlpha()}
                        />
                      </svg>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="option">
                    <label htmlFor="text-orientation" title="Text orientation">
                      <span className="label-text">Text orientation</span>
                    </label>
                    <input
                      id="text-orientation"
                      className="input-number"
                      type="number"
                      value={this.getTextRotation()}
                      onChange={this.handleRotationChange}
                    />
                  </div>
                </li>
              </ul>
            </div>
            <input
              type="submit"
              className="input-style small-cta"
              value="Apply"
            />
          </form>
          <button
            className="input-style small-cta"
            onClick={this.handleShowModal}
          >
            Cancel
          </button>
        </ReactModal>
      </div>
    );
  }
}
