import React, { Component } from 'react';
import ReactModal from 'react-modal';
import gridsHandler from '../../gridsHandler';
import config from '../../config/configHandler';
import notif from '../../notifications';
import colorThemes from '../../config/colorThemes';
import { ReactComponent as IconFolderOpen } from '../../media/icon-folder-open.svg';
import { ReactComponent as IconCross } from '../../media/icon-cross.svg';
import { ReactComponent as IconLink } from '../../media/icon-link.svg';

class ManageGridsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { displayLinkToCopy: false };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.deleteGrid = this.deleteGrid.bind(this);
    this.loadGrid = this.loadGrid.bind(this);
    this.copyGridExportString = this.copyGridExportString.bind(this);
    this.modalStyle = config.get().modalStyle;
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  deleteGrid(gridName, event) {
    event.preventDefault();
    this.props.deleteGrid(gridName);
  }

  loadGrid(gridName, event) {
    event.preventDefault();
    notif.gridSuccessfullyLoaded();
    this.props.loadGrid('user', gridName);
  }

  copyGridExportString(exportString, event) {
    event.preventDefault();
    this.setState({ displayLinkToCopy: exportString }, () => {
      this.inputLink.select();
      try {
        document.execCommand('copy');
        notif.gridLinkCopied();
      } catch (error) {
        notif.gridLinkNotCopied(error);
      }
      this.setState({ displayLinkToCopy: false });
    });
  }

  render() {
    const userGrids = gridsHandler.getUserGrids();
    const gridsNames = Object.keys(userGrids);
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
          <h2>Manage your grids</h2>
          <ul className="grids-list">
            {gridsNames.map((gridName, i) => {
              return (
                <li key={i}>
                  <h6 className="grid-name">
                    {gridName}
                    <span className="grid-size">
                      {`[${userGrids[gridName].gridSize[0]}, ${
                        userGrids[gridName].gridSize[1]
                      }]`}
                    </span>
                  </h6>
                  <div className="actions-wrapper">
                    <a
                      href="#delete-grid"
                      className="action-icon"
                      alt="Cross icon"
                      title="Delete the grid."
                      onClick={this.deleteGrid.bind(this, gridName)}
                    >
                      <IconCross
                        fill={colorThemes[this.props.colorTheme].footerText}
                      />
                    </a>

                    <a
                      href="#load-grid"
                      className="action-icon"
                      alt="Load icon"
                      title="Load the grid."
                      onClick={this.loadGrid.bind(this, gridName)}
                    >
                      <IconFolderOpen
                        fill={colorThemes[this.props.colorTheme].footerText}
                      />
                    </a>

                    <a
                      href="#copy-link"
                      className="action-icon"
                      alt="Link icon"
                      title="Copy the URL of the grid in your clipboard to share it."
                      onClick={this.copyGridExportString.bind(
                        this,
                        userGrids[gridName].exportString
                      )}
                    >
                      <IconLink
                        fill={colorThemes[this.props.colorTheme].footerText}
                      />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          {// Temporary input to select grid link and copy it programmatically
          this.state.displayLinkToCopy ? (
            <input
              type="text"
              readOnly="true"
              value={this.state.displayLinkToCopy}
              ref={inputLink => {
                this.inputLink = inputLink;
              }}
            />
          ) : (
            ''
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

export default ManageGridsModal;
