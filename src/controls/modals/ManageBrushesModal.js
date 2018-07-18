import React, { Component } from 'react';
import ReactModal from 'react-modal';
import brushesHandler from '../../brushesHandler';
import config from '../../config/configHandler';
import notif from '../../notifications';
import colorThemes from '../../config/colorThemes';
import IconFolderOpen from '../../media/icon-folder-open.svg';
import IconCross from '../../media/icon-cross.svg';
import IconLink from '../../media/icon-link.svg';

export default class ManageBrushesModal extends Component {
  constructor(props) {
    super(props);
    this.state = { displayLinkToCopy: false };
    this.handleShowModal = this.handleShowModal.bind(this);
    this.deleteBrush = this.deleteBrush.bind(this);
    this.loadBrush = this.loadBrush.bind(this);
    this.copyBrushExportString = this.copyBrushExportString.bind(this);
    this.modalStyle = config.get().modalStyle;
  }

  handleShowModal() {
    this.props.handleShowModal();
  }

  deleteBrush(brushName, event) {
    event.preventDefault();
    this.props.deleteBrush(brushName);
  }

  loadBrush(brushName, event) {
    event.preventDefault();
    notif.brushSuccessfullyLoaded();
    this.props.loadBrush('custom', brushName);
  }

  copyBrushExportString(exportString, event) {
    event.preventDefault();
    this.setState({ displayLinkToCopy: exportString }, () => {
      this.inputLink.select();
      try {
        document.execCommand('copy');
        notif.brushLinkCopied();
      } catch (error) {
        notif.brushLinkNotCopied(error);
      }
      this.setState({ displayLinkToCopy: false });
    });
  }

  render() {
    const customBrushes = brushesHandler.getCustomBrushes();
    const brushesNames = Object.keys(customBrushes);
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
          <h2>Manage your custom brushes</h2>
          <ul className="brushes-list">
            {brushesNames.map((brushName, i) => {
              return (
                <li key={i}>
                  <h6 className="brush-name">
                    {brushName}
                    <span className="brush-size">
                      {`[${customBrushes[brushName].brushSize[0]}, ${
                        customBrushes[brushName].brushSize[1]
                      }]`}
                    </span>
                  </h6>
                  <div className="actions-wrapper">
                    <a
                      href="#delete-brush"
                      className="action-icon"
                      alt="Cross icon"
                      title="Delete the brush."
                      onClick={this.deleteBrush.bind(this, brushName)}
                    >
                      <IconCross
                        fill={colorThemes[this.props.colorTheme].footerText}
                      />
                    </a>

                    <a
                      href="#load-brush"
                      className="action-icon"
                      alt="Load icon"
                      title="Load the brush."
                      onClick={this.loadBrush.bind(this, brushName)}
                    >
                      <IconFolderOpen
                        fill={colorThemes[this.props.colorTheme].footerText}
                      />
                    </a>

                    <a
                      href="#copy-link"
                      className="action-icon"
                      alt="Link icon"
                      title="Copy the URL of the brush in your clipboard to share it."
                      onClick={this.copyBrushExportString.bind(
                        this,
                        customBrushes[brushName].exportString
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

          {// Temporary input to select brush link and copy it programmatically
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
