import React, { Component } from 'react';
import ReactModal from 'react-modal';
import config from '../../config/configHandler';
const configData = config.get();

class DownloadGridModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadFormat: configData.downloadFormat,
      filename: null,
    };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.downloadGrid = this.downloadGrid.bind(this);
    this.handleFormatChange = this.handleFormatChange.bind(this);
    this.handleFilenameChange = this.handleFilenameChange.bind(this);
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  downloadGrid(event) {
    event.preventDefault();
    this.props.downloadGrid(
      this.state.downloadFormat,
      this.gridDownloadInput.value
    );
  }

  handleFormatChange(event) {
    const format = event.target.value;
    const filename = this.gridDownloadInput.value;
    this.setState(
      prevState => ({
        filename: filename.replace(/\.[^/.]+$/, `.${format}`),
        downloadFormat: format,
      }),
      () => {
        config.save({ downloadFormat: format });
      }
    );
  }

  handleFilenameChange(event) {
    this.setState({
      filename: event.target.value,
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
            base: 'modal download-grid-modal',
            afterOpen: 'modal-opened',
            beforeClose: 'modal-closed',
          }}
        >
          <h2>Download the grid</h2>
          <form onSubmit={this.downloadGrid}>
            <p>Choose the format to download to:</p>
            <div>
              <input
                type="radio"
                id="svg"
                name="format"
                value="svg"
                checked={this.state.downloadFormat === 'svg'}
                onChange={this.handleFormatChange}
              />
              <label htmlFor="svg">SVG</label>
              <input
                type="radio"
                id="png"
                name="format"
                value="png"
                onChange={this.handleFormatChange}
                checked={this.state.downloadFormat === 'png'}
              />
              <label htmlFor="png">PNG</label>
            </div>
            <p>Choose the filename:</p>
            <input
              className="input-style"
              type="text"
              name="filename"
              placeholder="Paste filename here"
              value={
                this.state.filename
                  ? this.state.filename
                  : `${
                      this.props.activeGrid.name
                        ? this.props.activeGrid.name
                        : 'grid'
                    }.${configData.downloadFormat}`
              }
              onChange={this.handleFilenameChange}
              ref={input => (this.gridDownloadInput = input)}
            />
            <input
              type="submit"
              className="input-style small-cta"
              value="Download grid"
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

export default DownloadGridModal;
