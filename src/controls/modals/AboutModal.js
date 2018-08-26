import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class AboutModal extends Component {
  constructor(props) {
    super(props);
    this.handleShowModal = this.handleShowModal.bind(this);
  }

  handleShowModal() {
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
            base: 'modal modal-about',
            afterOpen: 'modal-opened',
            beforeClose: 'modal-closed',
          }}
        >
          <h2>About this project</h2>
          <p>
            This project is an app to create scalable vector grids, it is coded
            with{' '}
            <a
              href="https://github.com/facebook/create-react-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              create-react-app
            </a>
            .
          </p>
          <p>
            Created by{' '}
            <a
              href="https://www.cravesoft.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Olivier Crave
            </a>
            , MIT License.
          </p>
          <p>
            You can find the{' '}
            <a
              href="https://github.com/cravesoft/gridbrush"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github repo here
            </a>
            .
          </p>
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
