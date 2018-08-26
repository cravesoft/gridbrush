import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class SaveGridModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.saveGrid = this.saveGrid.bind(this);
    this.selectLink = this.selectLink.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  saveGrid(event) {
    event.preventDefault();
    this.props.saveGrid(this.gridNameInput.value);
  }

  selectLink(event) {
    this.gridNameLink.setSelectionRange(0, this.gridNameLink.value.length);
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value,
    });
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
          <h2>Save & share your grid</h2>
          {// Display save grid form if not saved yet
          !this.props.activeGrid.name || !this.props.activeGrid.exportString ? (
            <form onSubmit={this.saveGrid}>
              <p>
                To save your grid,
                <br />
                you need to give it a name.
              </p>
              <input
                className="input-style"
                type="text"
                placeholder="Grid name"
                maxLength={30}
                ref={input => (this.gridNameInput = input)}
                value={
                  this.state.name
                    ? this.state.name
                    : this.props.activeGrid.name
                      ? this.props.activeGrid.name
                      : ''
                }
                onChange={this.handleNameChange}
              />
              <input
                type="submit"
                className="input-style small-cta"
                value="Save grid"
              />
            </form>
          ) : (
            // Display saved notif and grid export string in a read-only input
            <div>
              <p className="green-notification">✓ Grid saved</p>
              <p>Share this grid by sending the grid export string below:</p>
              <input
                className="input-style share-link-input"
                type="text"
                readOnly="true"
                ref={input => (this.gridNameLink = input)}
                onClick={this.selectLink}
                value={this.props.activeGrid.exportString}
              />
            </div>
          )}
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
