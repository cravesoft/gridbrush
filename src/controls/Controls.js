import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Select, Checkbox } from './inputs/index';
import { SketchPicker } from 'react-color';
import config from '../config/configHandler';
import Cell from '../grid/Cell';
import gridsHandler from '../gridsHandler';
import colorThemes from '../config/colorThemes';
//import ImportBrushModal from './modals/ImportBrushModal';
import ResetGridModal from './modals/ResetGridModal';
import ImportGridModal from './modals/ImportGridModal';
import DownloadGridModal from './modals/DownloadGridModal';
import ManageGridsModal from './modals/ManageGridsModal';
import SaveGridModal from './modals/SaveGridModal';
import IconRightArrow from '../media/icon-right-arrow.svg';
import IconBars from '../media/icon-bars.svg';
import utils from '../utils';
import '../css/controls/Controls.css';
import '../css/controls/Modal.css';
const configData = config.get();
const themesList = utils.getSelectList(Object.keys(colorThemes));
const borderSizeList = utils.getSelectList(configData.borderSizesList);

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isControlsOpen: configData.isControlsOpen,
      isOptionsOpen: configData.isOptionsOpen,
      isSketchPickerOpen: false,
      displayColorPicker: false,
      resetGridModalOpen: false,
      importGridModalOpen: false,
      downloadGridModalOpen: false,
      manageGridsModalOpen: false,
      saveGridModalOpen: false,
      //importBrushModalOpen: false,
      //manageBrushesModalOpen: false,
      headerHeight: 0,
    };
    ReactModal.setAppElement('#app');
    this.resizeTimer = undefined;
    this.toggleControls = this.toggleControls.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.switchShowGridlines = this.switchShowGridlines.bind(this);
    this.changeTimeCompression = this.changeTimeCompression.bind(this);
    this.changeColorTheme = this.changeColorTheme.bind(this);
    this.handleGridChange = this.handleGridChange.bind(this);
    this.resetGrid = this.resetGrid.bind(this);
    this.importGrid = this.importGrid.bind(this);
    this.downloadGrid = this.downloadGrid.bind(this);
    this.saveGrid = this.saveGrid.bind(this);
    this.deleteGrid = this.deleteGrid.bind(this);
    this.handleManageGridsModal = this.handleManageGridsModal.bind(this);
    this.handleImportGridModal = this.handleImportGridModal.bind(this);
    //this.importBrush = this.importBrush.bind(this);
    //this.handleImportBrushModal = this.handleImportBrushModal.bind(this);
    //this.handleManageBrushesModal = this.handleManageBrushesModal.bind(this);
    //this.deleteBrush = this.deleteBrush.bind(this);
    this.getMenuMaxHeight = this.getMenuMaxHeight.bind(this);
    this.onResize = this.onResize.bind(this);
    this.changeBorderSize = this.changeBorderSize.bind(this);
    this.handleResetGridModal = this.handleResetGridModal.bind(this);
    this.handleDownloadGridModal = this.handleDownloadGridModal.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.handleCustomColorChange = this.handleCustomColorChange.bind(this);
    this.handleSaveGridModal = this.handleSaveGridModal.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleBrushChange = this.handleBrushChange.bind(this);
  }

  toggleControls() {
    let value;
    this.setState(
      prevState => {
        return (value = { isControlsOpen: !prevState.isControlsOpen });
      },
      () => {
        config.save(value);
      }
    );
  }

  toggleOptions() {
    let value;
    this.setState(
      prevState => {
        return (value = { isOptionsOpen: !prevState.isOptionsOpen });
      },
      () => {
        config.save(value);
      }
    );
  }

  switchShowGridlines() {
    this.props.switchShowGridlines();
  }

  changeTimeCompression(event) {
    this.props.changeTimeCompression(event.target.value);
  }

  changeColorTheme(event) {
    this.props.changeColorTheme(event.target.value);
  }

  changeBorderSize(event) {
    const newSize =
      event.target.value !== '' ? parseInt(event.target.value, 10) : 0;
    this.props.changeBorderSize(newSize);
  }

  handleGridChange(type, event) {
    const gridName = event.target.value;
    if (gridName === 'Load a grid') return this.props.resetGrid();
    this.props.loadGridFromDb(type, gridName);
  }

  resetGrid() {
    this.props.resetGrid();
  }

  importGrid(gridExportString) {
    this.props.importGrid(gridExportString);
  }

  downloadGrid(format, filename) {
    this.props.downloadGrid(format, filename);
  }

  saveGrid(name) {
    this.props.saveGrid(name);
  }

  //importBrush(brushExportString) {
  //  this.props.importBrush(brushExportString);
  //}

  switchShowLayer(layerName, event) {
    this.props.switchShowLayer(layerName);
  }

  handleResetGridModal() {
    this.setState(prevState => {
      return { resetGridModalOpen: !prevState.resetGridModalOpen };
    });
  }

  handleImportGridModal() {
    this.setState(prevState => {
      return { importGridModalOpen: !prevState.importGridModalOpen };
    });
  }

  handleDownloadGridModal() {
    this.setState(prevState => {
      return { downloadGridModalOpen: !prevState.downloadGridModalOpen };
    });
  }

  handleManageGridsModal() {
    this.setState(prevState => {
      return { manageGridsModalOpen: !prevState.manageGridsModalOpen };
    });
  }

  deleteGrid(name) {
    if (!window.confirm('Do you really want to delete this grid ?')) {
      return;
    }
    const state = gridsHandler.deleteUserGrid(name);
    const isNoGridLeft = state === 'noGridLeft';
    const isActiveStateGrid = name === this.props.activeGrid.name;
    if (isNoGridLeft || isActiveStateGrid) {
      if (isNoGridLeft) this.handleManageGridsModal();
      if (isActiveStateGrid) this.resetGrid();
    } else {
      // refresh the grid list
      this.setState(this.state);
    }
  }

  toggleColorPicker() {
    this.setState(prevState => {
      return { displayColorPicker: !prevState.displayColorPicker };
    });
  }

  handleCustomColorChange(color) {
    this.props.handleCustomColorChange(color);
  }

  handleSaveGridModal() {
    this.setState(prevState => {
      return { saveGridModalOpen: !prevState.saveGridModalOpen };
    });
  }

  //handleBrushChange(type, event) {
  //  const brushName = event.target.value;
  //  if (brushName === 'Load a brush') return this.props.resetGrid();
  //  this.props.loadBrushFromDb(type, brushName);
  //}

  //handleImportBrushModal() {
  //  this.setState(prevState => {
  //    return { importBrushModalOpen: !prevState.importBrushModalOpen };
  //  });
  //}

  //handleManageBrushesModal() {
  //  this.setState(prevState => {
  //    return { manageBrushesModalOpen: !prevState.manageBrushesModalOpen };
  //  });
  //}

  //deleteBrush(name) {
  //  if (!window.confirm('Do you really want to delete this brush ?')) {
  //    return;
  //  }
  //}

  getMenuMaxHeight() {
    const headerGeometry = this.header.getBoundingClientRect();
    this.setState(() => {
      return { headerHeight: headerGeometry.bottom - headerGeometry.top };
    });
  }

  onResize() {
    // Debounce resize
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(this.getMenuMaxHeight, 200);
  }

  componentDidMount() {
    this.getMenuMaxHeight();
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.onResize);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (
      this.colorPicker &&
      !ReactDOM.findDOMNode(this.colorPicker).contains(event.target)
    ) {
      this.setState(prevState => {
        return { displayColorPicker: !prevState.displayColorPicker };
      });
    }
  }

  handleBrushChange(layer, tool, event) {
    event.preventDefault();
    this.props.changeBrush(layer, tool);
  }

  render() {
    const isOptionsMenuOpenClass = this.state.isOptionsOpen ? 'open' : '';
    const userGridsNames = gridsHandler.getUserGridsNames();
    const userGridSelectLabel =
      this.props.activeGrid.type === 'user'
        ? this.props.activeGrid.name
        : 'Load a grid';
    const exampleGridSelectLabel =
      this.props.activeGrid.type === 'example'
        ? this.props.activeGrid.name
        : 'Load a grid';
    const gridTitle = this.props.activeGrid.name
      ? this.props.activeGrid.name
      : 'Untitled';

    return (
      <section
        className={`controls ${this.state.isControlsOpen ? 'open' : ''}`}
        style={{
          backgroundColor: 'transparent',
          color: colorThemes[this.props.colorTheme].controlsText,
          borderColor: colorThemes[this.props.colorTheme].controlsBorder,
        }}
      >
        <style scoped>
          {`
            .open-controls-cta {
              background-color:
                ${colorThemes[this.props.colorTheme].controlsBackground}
            }

            button:hover, input[type=submit]:hover {background-color: ${
              colorThemes[this.props.colorTheme].buttonHoverBackground
            }}
            @media screen and (max-width: 560px) {.options-wrapper {max-height: ${window.innerHeight -
              this.state.headerHeight}px}
            }`}
        </style>
        <header ref={header => (this.header = header)}>
          <button
            className="open-controls-cta"
            onClick={this.toggleControls}
            alt="Right Arrow"
            title="Open / close controls"
          >
            <IconRightArrow
              width={24}
              height={24}
              className="icon"
              fill={colorThemes[this.props.colorTheme].controlsText}
            />
          </button>
          <div className="controls-bar-wrapper">
            <div
              className="info-bar"
              style={{
                backgroundColor:
                  colorThemes[this.props.colorTheme].controlsBackground,
              }}
            >
              <div className="info title" title={gridTitle}>
                {gridTitle}
              </div>
              <div className="info grid-coords">
                {`[${this.props.col}, ${this.props.row}]`}
              </div>
              <div className="info cells-graph">
                <div
                  className="background"
                  style={{
                    backgroundColor:
                      colorThemes[this.props.colorTheme].deadCell,
                  }}
                >
                  <span
                    className="value"
                    style={{
                      color: colorThemes[this.props.colorTheme].cellGraphText,
                    }}
                  >{`${this.props.currentLayer}, ${
                    this.props.currentBrush
                  }`}</span>
                </div>
              </div>
              <div className="info options">
                <button
                  className={`${isOptionsMenuOpenClass}`}
                  title="Open / Close the options"
                  alt="Down arrow button"
                  onClick={this.toggleOptions}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  <IconBars
                    className="icon"
                    width={14}
                    height={14}
                    fill={colorThemes[this.props.colorTheme].controlsText}
                  />
                </button>
              </div>
            </div>
            <div
              className={`options-wrapper ${isOptionsMenuOpenClass}`}
              style={{
                backgroundColor:
                  colorThemes[this.props.colorTheme].optionsMenuBackground,
              }}
            >
              <style scoped>
                {`.checkbox-wrapper label .checkbox-icon {border-color: ${
                  colorThemes[this.props.colorTheme].controlsText
                }}
                  .checkbox-wrapper input[type=checkbox]:checked + label .checkbox-icon {background-color: ${
                    colorThemes[this.props.colorTheme].controlsText
                  }}`}
              </style>
              <ul className="options-list">
                <li>
                  <Checkbox
                    id="show-gridlines"
                    label="Show gridlines"
                    isChecked={this.props.showGridlines}
                    title="Show the gridlines."
                    handleChange={this.switchShowGridlines}
                  />
                </li>
                <li>
                  <Select
                    label="Color theme"
                    defaultValue={this.props.colorTheme}
                    options={themesList}
                    handleChange={this.changeColorTheme}
                  />
                </li>

                <li>
                  <Select
                    label="Border Size (in px)"
                    type="border"
                    defaultValue={this.props.borderSize}
                    options={borderSizeList}
                    handleChange={this.changeBorderSize}
                  />
                </li>

                {Array.isArray(this.props.gridsLibraryNames) ? (
                  <li>
                    <div className="input-block select-wrapper">
                      <label className="input-label">
                        <span>Example grids</span>
                        <select
                          className="input-style"
                          value={exampleGridSelectLabel}
                          onChange={this.handleGridChange.bind(this, 'example')}
                        >
                          {this.props.gridsLibraryNames.map((el, index) => (
                            <option key={index} value={el}>
                              {el}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </li>
                ) : (
                  ''
                )}

                {userGridsNames ? (
                  <li>
                    <div className="input-block select-wrapper">
                      <label className="input-label">
                        <span>Your grids</span>
                        <select
                          className="input-style"
                          value={userGridSelectLabel}
                          onChange={this.handleGridChange.bind(this, 'user')}
                        >
                          {userGridsNames.map((el, index) => {
                            return (
                              <option key={index} value={el}>
                                {el}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                  </li>
                ) : (
                  ''
                )}

                <li>
                  <div className="input-block">
                    <button
                      id="reset-grid-cta"
                      className="input-style small-cta"
                      title="Reset the grid"
                      onClick={this.handleResetGridModal}
                    >
                      Reset the grid
                    </button>
                    <ResetGridModal
                      showModal={this.state.resetGridModalOpen}
                      handleShowModal={this.handleResetGridModal}
                      resetGrid={this.resetGrid}
                      colorTheme={this.props.colorTheme}
                      modalStyle={this.props.modalStyle}
                    />
                  </div>
                </li>

                <li>
                  <div className="input-block">
                    <button
                      id="save-grid-cta"
                      className="input-style small-cta"
                      title="Save and share your grid."
                      onClick={this.handleSaveGridModal}
                    >
                      Save & share
                    </button>
                    <SaveGridModal
                      showModal={this.state.saveGridModalOpen}
                      handleShowModal={this.handleSaveGridModal}
                      saveGrid={this.saveGrid}
                      activeGrid={this.props.activeGrid}
                      colorTheme={this.props.colorTheme}
                      modalStyle={this.props.modalStyle}
                    />
                  </div>
                </li>

                <li>
                  <div className="input-block">
                    <button
                      id="import-grid-cta"
                      className="input-style small-cta"
                      title="Import a grid"
                      onClick={this.handleImportGridModal}
                    >
                      Import a grid
                    </button>
                    <ImportGridModal
                      showModal={this.state.importGridModalOpen}
                      handleShowModal={this.handleImportGridModal}
                      importGrid={this.importGrid}
                      colorTheme={this.props.colorTheme}
                      modalStyle={this.props.modalStyle}
                    />
                  </div>
                </li>

                <li>
                  <div className="input-block">
                    <button
                      id="download-grid-cta"
                      className="input-style small-cta"
                      title="Download the grid"
                      onClick={this.handleDownloadGridModal}
                    >
                      Download the grid
                    </button>
                    <DownloadGridModal
                      showModal={this.state.downloadGridModalOpen}
                      handleShowModal={this.handleDownloadGridModal}
                      downloadGrid={this.downloadGrid}
                      activeGrid={this.props.activeGrid}
                      colorTheme={this.props.colorTheme}
                      modalStyle={this.props.modalStyle}
                    />
                  </div>
                </li>

                {userGridsNames ? (
                  <li>
                    <div className="input-block">
                      <button
                        id="manage-grid-cta"
                        className="input-style small-cta"
                        title="Manage your grids"
                        onClick={this.handleManageGridsModal}
                      >
                        Manage grids
                      </button>
                      <ManageGridsModal
                        showModal={this.state.manageGridsModalOpen}
                        handleShowModal={this.handleManageGridsModal}
                        loadGrid={this.props.loadGridFromDb}
                        activeGrid={this.props.activeGrid}
                        deleteGrid={this.deleteGrid}
                        colorTheme={this.props.colorTheme}
                        modalStyle={this.props.modalStyle}
                      />
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="controls-bar">
              <div
                className="toolbar big-cta"
                style={{
                  backgroundColor:
                    colorThemes[this.props.colorTheme].controlsBackground,
                }}
              >
                {Object.keys(configData.layers).map(layerName => {
                  return (
                    <div
                      key={layerName}
                      className="layer"
                      data-layer={layerName}
                      style={{
                        opacity: this.props.showLayers[layerName] ? 1 : 0.5,
                      }}
                    >
                      <span
                        title={configData.text[layerName + '-text']}
                        onClick={e => this.switchShowLayer(layerName, e)}
                      >
                        {configData.text[layerName]}
                      </span>
                      {configData.layers[layerName].map((brushName, i) => {
                        return (
                          <div
                            className={`${
                              this.props.currentBrush === brushName &&
                              this.props.currentLayer === layerName
                                ? 'selected'
                                : ''
                            }`}
                            key={brushName}
                            role="button"
                            data-layer={layerName}
                            title={configData.text[layerName + '-' + brushName]}
                            onClick={e => {
                              this.handleBrushChange(layerName, brushName, e);
                            }}
                            style={{
                              backgroundColor:
                                colorThemes[this.props.colorTheme]
                                  .controlsBackground,
                            }}
                          >
                            {brushName === 'g10' ? (
                              <div
                                className="colorpicker"
                                title="Select custom color"
                                onClick={this.toggleColorPicker}
                                style={{
                                  backgroundColor:
                                    colorThemes[this.props.colorTheme]
                                      .controlsBackground,
                                }}
                              />
                            ) : null}
                            {brushName === 'g10' &&
                            this.state.displayColorPicker ? (
                              <div
                                style={{
                                  position: 'absolute',
                                  zIndex: '2',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'fixed',
                                    top: '0px',
                                    right: '0px',
                                    bottom: '0px',
                                    left: '0px',
                                  }}
                                  onClick={this.handleClose}
                                />
                                <SketchPicker
                                  ref={colorPicker =>
                                    (this.colorPicker = colorPicker)
                                  }
                                  disableAlpha={false}
                                  color={this.props.customColor}
                                  onChange={this.handleCustomColorChange}
                                />
                              </div>
                            ) : null}
                            <svg
                              version="1.1"
                              baseProfile="full"
                              xmlns="http://www.w3.org/2000/svg"
                              width={30}
                              height={30}
                            >
                              <Cell
                                key={i}
                                index={i}
                                xPos={0}
                                yPos={0}
                                size={30}
                                content={{ center: brushName }}
                              />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>
      </section>
    );
  }
}

export default Controls;

//{Array.isArray(this.props.brushesLibraryNames) ? (
//  <li>
//    <div className="input-block select-wrapper">
//      <label className="input-label">
//        <span>Default brushes</span>
//        <select
//          className="input-style"
//          value="Load a brush"
//          //value={defaultBrushSelectLabel}
//          onChange={this.handleBrushChange.bind(
//            this,
//            'default'
//          )}
//        >
//          {this.props.brushesLibraryNames.map((el, index) => (
//            <option key={index} value={el}>
//              {el}
//            </option>
//          ))}
//        </select>
//      </label>
//    </div>
//  </li>
//) : (
//  null
//)}

//<li>
//  <div className="input-block">
//    <button
//      id="import-brush-cta"
//      className="input-style small-cta"
//      title="Import a brush"
//      onClick={this.handleImportBrushModal}
//    >
//      Import a brush
//    </button>
//    <ImportBrushModal
//      showModal={this.state.importBrushModalOpen}
//      handleShowModal={this.handleImportBrushModal}
//      importBrush={this.importBrush}
//      colorTheme={this.props.colorTheme}
//      modalStyle={this.props.modalStyle}
//    />
//  </div>
//</li>
