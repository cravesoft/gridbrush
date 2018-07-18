import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class ResetGridModal extends Component {
  constructor(props) {
    super(props);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.resetGrid = this.resetGrid.bind(this);
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  resetGrid(event) {
    event.preventDefault();
    this.props.resetGrid();
    this.props.handleShowModal();
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
          <h2>Reset the grid</h2>
          <form onSubmit={this.resetGrid}>
            <p>Are you sure you want to reset the grid?</p>
            <input
              type="submit"
              className="input-style small-cta"
              value="Yes"
            />
          </form>
          <button
            className="input-style small-cta"
            onClick={this.handleShowModal}
          >
            No
          </button>
        </ReactModal>
      </div>
    );
  }
}
