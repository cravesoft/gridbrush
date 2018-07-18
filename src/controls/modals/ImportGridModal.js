import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class SaveGridModal extends Component {
  constructor(props) {
    super(props);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.importGrid = this.importGrid.bind(this);
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  importGrid(event) {
    event.preventDefault();
    this.props.importGrid(this.gridImportInput.value);
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
            base: 'modal import-grid-modal',
            afterOpen: 'modal-opened',
            beforeClose: 'modal-closed',
          }}
        >
          <h2>Import a grid</h2>
          <form onSubmit={this.importGrid}>
            <p>Paste the grid export string below.</p>
            <input
              className="input-style"
              type="text"
              placeholder="Paste grid export string here"
              ref={input => (this.gridImportInput = input)}
            />
            <input
              type="submit"
              className="input-style small-cta"
              value="Import grid"
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
