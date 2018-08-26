import React, { Component } from 'react';
import colorThemes from './config/colorThemes';
import IconGithub from './media/icon-github.svg';
import IconFacebook from './media/icon-facebook.svg';
import IconTwitter from './media/icon-twitter.svg';
import AboutModal from './controls/modals/AboutModal';
import pckg from '../package.json';
import './css/Footer.css';

const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  pckg.description
)}
&via=Sarcadass&url=${encodeURIComponent(pckg.url)}`;

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { isAboutModalOpen: false };
    this.handleAboutModal = this.handleAboutModal.bind(this);
  }

  handleAboutModal(event) {
    if (event) event.preventDefault();
    this.setState(prevState => {
      return { isAboutModalOpen: !prevState.isAboutModalOpen };
    });
  }

  render() {
    return (
      <footer style={{ color: colorThemes[this.props.colorTheme].footerText }}>
        <div className="social-share-wrapper">
          {/* Github Link */}
          <a
            className="github"
            href="https://github.com/cravesoft/gridbrush"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconGithub
              width={20}
              height={20}
              fill={colorThemes[this.props.colorTheme].footerText}
            />
          </a>
          {/* Share on Facebook */}
          <a
            className="social-cta facebook"
            href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(
              pckg.url
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconFacebook width={12} height={12} fill="#fff" /> Share on
            Facebook
          </a>
          {/* Share on Twitter */}
          <a
            className="social-cta twitter"
            href={twitterLink}
            target="_blank"
            rel="noopener"
          >
            <IconTwitter width={12} height={12} fill="#fff" /> Share on Twitter
          </a>
          <AboutModal
            showModal={this.state.isAboutModalOpen}
            handleShowModal={this.handleAboutModal}
            colorTheme={this.props.colorTheme}
            modalStyle={this.props.modalStyle}
          />
        </div>

        <p className="credits-wrapper">
          <span className="first-row">
            <strong>GridBrush v{pckg.version}. </strong>
            <a
              className="about-modal-cta"
              href="#open-about-modal"
              onClick={this.handleAboutModal}
            >
              About this project
            </a>
            .
          </span>
          Created by{' '}
          <a
            href="https://www.cravesoft.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {pckg.author}
          </a>
          , {pckg.license} license.
        </p>
      </footer>
    );
  }
}
