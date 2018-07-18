import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class SaveBrushModal extends Component {
  constructor(props) {
    super(props);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.importBrush = this.importBrush.bind(this);
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  importBrush(event) {
    event.preventDefault();
    this.props.importBrush(this.brushImportInput.value);
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
            base: 'modal import-brush-modal',
            afterOpen: 'modal-opened',
            beforeClose: 'modal-closed',
          }}
        >
          <h2>Import a custom brush</h2>
          <form onSubmit={this.importBrush}>
            <p>Paste the brush export string below.</p>
            <input
              className="input-style"
              type="text"
              placeholder="Paste brush export string here"
              ref={input => (this.brushImportInput = input)}
            />
            <input
              type="submit"
              className="input-style small-cta"
              value="Import brush"
            />
          </form>
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
