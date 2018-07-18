import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { ChromePicker } from 'react-color';

class ChangeCustomColorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#fff',
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  handleChange(color) {
    this.setState({ color: color.rgb });
    this.props.handleChange(color);
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
            base: 'modal',
            afterOpen: 'modal-opened',
            beforeClose: 'modal-closed',
          }}
        >
          <h2>Pick a color</h2>
          <ChromePicker
            style={{ width: '80%', margin: '0 auto' }}
            color={this.state.color}
            onChange={this.handleChange}
          />
          <button
            className="input-style small-cta"
            onClick={this.handleShowModal}
          >
            Close
          </button>
        </ReactModal>
      </div>
    );
  }
}

export default ChangeCustomColorModal;
