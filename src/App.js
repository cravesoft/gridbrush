import React, { Component } from 'react';
import FileSaver from 'file-saver';
import config from './config/configHandler';
import colorThemes from './config/colorThemes';
import utils from './utils';
import Controls from './controls/Controls';
import Mouse from './Mouse';
import Footer from './Footer';
import Layer from './grid/Layer';
import TextTool from './tools/TextTool';
import PatchTool from './tools/PatchTool';
import BackstitchTool from './tools/BackstitchTool';
import Panning from './Panning';
import NotificationSystem from 'react-notification-system';
import gridsHandler from './gridsHandler';
import brushesHandler from './brushesHandler';
import notif from './notifications';
import './css/App.css';
const configData = config.get();
let gridsLibrary = null;
let brushesLibrary = null;

class App extends Component {
  constructor(props) {
    super(props);
    utils.initGridData(configData.cellSize);
    this.state = {
      col: 0,
      row: 0,
      customColor: configData.customColor,
      cellSize: configData.cellSize,
      borderSize: configData.borderSize,
      randomSeed: configData.randomSeed,
      showGridlines: configData.showGridlines,
      gridSize: utils.getGridSize(),
      gridsLibraryNames: null,
      activeGrid: { name: null, exportString: null },
      colorTheme: configData.colorTheme,
      modalStyle: config.getModalStyle(configData.colorTheme),
      grid: null,
      showLayers: null,
      displayGrid: null,
      currentBrush: null,
      currentLayer: null,
      isPanning: false,
      shiftCoord: { x: 0, y: 0 },
    };
    this.startPanCoord = null;
    this.startPanDisplacement = null;
    this.pixelRatio = window.devicePixelRatio;
    this.currentIndexChanged = {};
    this.tools = {};
    this.changeColorTheme = this.changeColorTheme.bind(this);
    this.changeBrush = this.changeBrush.bind(this);
    this.resetGrid = this.resetGrid.bind(this);
    this.changeCellSize = this.changeCellSize.bind(this);
    this.changeBorderSize = this.changeBorderSize.bind(this);
    this.saveGrid = this.saveGrid.bind(this);
    this.downloadGrid = this.downloadGrid.bind(this);
    this.importGrid = this.importGrid.bind(this);
    this.loadGridFromDb = this.loadGridFromDb.bind(this);
    this.importBrush = this.importBrush.bind(this);
    this.loadBrushFromDb = this.loadBrushFromDb.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleMouseActions = this.handleMouseActions.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.switchShowGridlines = this.switchShowGridlines.bind(this);
    this.switchShowLayer = this.switchShowLayer.bind(this);
    this.handleCustomColorChange = this.handleCustomColorChange.bind(this);
    this.handlePanningChange = this.handlePanningChange.bind(this);
    this.handleCoordChange = this.handleCoordChange.bind(this);
    this.updateCellContent = this.updateCellContent.bind(this);
    this.removeCell = this.removeCell.bind(this);
    this.updateDisplayCellContent = this.updateDisplayCellContent.bind(this);
  }

  changeColorTheme(value) {
    let newColorTheme = { colorTheme: value };
    this.setState(
      {
        ...newColorTheme,
        modalStyle: config.getModalStyle(value),
      },
      () => {
        config.save(newColorTheme);
      }
    );
  }

  changeBrush(layer, brush) {
    this.setState({
      currentLayer: layer,
      currentBrush: brush,
    });
  }

  resetGrid() {
    const configToSave = { activeGrid: null };
    this.setState(
      {
        grid: utils.createGrid(),
        displayGrid: utils.createGrid(),
        showLayers: utils.createShowLayers(),
        gridSize: utils.getGridSize(),
        shiftCoord: { x: 0, y: 0 },
        activeGrid: { name: null, exportString: null },
      },
      () => {
        config.save(configToSave);
      }
    );
  }

  changeCellSize(cellSize) {
    let newCellSize = cellSize !== undefined ? cellSize : this.state.cellSize;
    if (newCellSize < 2) newCellSize = 2;
    let configToSave = { cellSize: newCellSize };
    // If cell size is too big and there is no cell
    // that can fit the grid
    if (!utils.gridHasCells(newCellSize)) {
      notif.clearAll();
      return notif.cellSizeTooBig();
    }
    utils.initGridData(newCellSize);
    let newState = {
      cellSize: newCellSize,
      gridSize: utils.getGridSize(),
    };
    this.setState(newState, () => {
      config.save(configToSave);
    });
    return newCellSize;
  }

  changeBorderSize(borderSize) {
    const newBorderSize =
      borderSize !== undefined ? borderSize : this.state.borderSize;
    let configToSave = { borderSize: newBorderSize };
    let newState = {
      borderSize: newBorderSize,
    };
    this.setState(newState, () => {
      config.save(configToSave);
    });
  }

  saveGrid(name) {
    if (gridsHandler.loadUserGrid(name)) {
      if (!window.confirm('This grid already exists. Overwrite it ?')) {
        return;
      }
    }
    let gridData = {
      name,
      grid: this.state.grid,
      gridSize: this.state.gridSize,
    };
    gridsHandler.saveUserGrid(gridData);
    const exportString = gridsHandler.loadUserGrid(name).exportString;
    const configToSave = { activeGrid: { type: 'user', name } };
    this.setState(
      {
        activeGrid: { type: 'user', name, exportString },
      },
      () => {
        config.save(configToSave);
      }
    );
  }

  downloadGrid(format, filename) {
    if (format === 'svg') {
      FileSaver.saveAs(
        new Blob([new XMLSerializer().serializeToString(this.svg)], {
          type: 'image/svg+xml;charset=' + document.characterSet,
        }),
        filename
      );
    } else {
      // Convert svg to canvas, then export to png
      const svgString = utils.getSVGString(this.svg);
      const width = this.svg.getAttribute('width');
      const height = this.svg.getAttribute('height');
      utils.svgString2Image(svgString, width, height, blob => {
        FileSaver.saveAs(blob, filename);
      });
    }
  }

  importGrid(gridExportString) {
    const gridData = gridsHandler.decodeGridExportString(gridExportString);
    const isAlreadyExistingGrid = gridsHandler.doesImportGridAlreadyExist(
      gridExportString
    );
    // If gridExportString is not a valid Base64 string
    if (!gridData) {
      return notif.wrongGridExportString();
    }
    // If same grid already exists in user grids
    if (isAlreadyExistingGrid) {
      return notif.gridAlreadyExists(isAlreadyExistingGrid);
    }
    gridsHandler.importUserGrid(gridData, gridExportString);
    notif.gridSuccessfullyImported();
    this.loadGridFromDb('user', gridData.name);
  }

  loadGrid(gridData, type) {
    const gridSize = this.state.gridSize;
    // If grid size is bigger than actual grid size,
    // reduce cell size to make it fit
    let cellSize = this.state.cellSize;
    if (
      gridSize[0] < gridData.gridSize[0] ||
      gridSize[1] < gridData.gridSize[1]
    ) {
      const newCellValues = utils.adaptGridSizeToGridSize(
        gridData.gridSize,
        this.state.cellSize,
        this.state.borderSize
      );
      // If grid is still too big even with minimal
      // cell size, display notif
      cellSize = this.changeCellSize(newCellValues);
      notif.clearAll();
      notif.cellSizeChanged();
    }
    // Translate all cells to have the grid centered on the screen
    const min = utils.getMinCoords(gridData.grid);
    const shiftCoord = {
      x: -min.col * cellSize,
      y: -min.row * cellSize,
    };
    const configToSave = { activeGrid: { type, name: gridData.name } };
    this.setState(
      {
        activeGrid: {
          type,
          name: gridData.name,
          exportString: gridData.exportString,
        },
        displayGrid: gridData.grid,
        grid: gridData.grid,
        shiftCoord,
      },
      () => {
        config.save(configToSave);
      }
    );
  }

  loadGridFromDb(type, name) {
    const gridData =
      type === 'user' ? gridsHandler.loadUserGrid(name) : gridsLibrary[name];
    this.loadGrid(gridData, type);
  }

  importBrush(brushExportString) {
    const brushData = brushesHandler.decodeBrushExportString(brushExportString);
    const isAlreadyExistingBrush = brushesHandler.doesImportBrushAlreadyExist(
      brushExportString
    );
    // If brushExportString is not a valid Base64 string
    if (!brushData) {
      return notif.wrongBrushExportString();
    }
    // If same brush already exists in custom brushes
    if (isAlreadyExistingBrush) {
      return notif.brushAlreadyExists(isAlreadyExistingBrush);
    }
    brushesHandler.importCustomBrush(brushData, brushExportString);
    notif.brushSuccessfullyImported();
    this.loadBrushFromDb('custom', brushData.name);
  }

  loadBrush(brushData, type) {
    const gridSize = this.state.gridSize;
    // If brush size is bigger than actual grid size,
    // reduce cell size size to make it fit
    if (
      gridSize[0] < brushData.brushSize[0] ||
      gridSize[1] < brushData.brushSize[1]
    ) {
      const newCellAndBorderValues = utils.adaptGridSizeToBrushSize(
        brushData.brushSize,
        this.state.cellSize
      );
      // If brush is still too big even with minimal
      // cell size, display notif
      if (!newCellAndBorderValues) return notif.brushIsTooBig();
      this.changeCellSize(newCellAndBorderValues);
      notif.clearAll();
      notif.cellSizeChanged();
    }
    this.setState(
      {
        activeGrid: {
          name: brushData.name,
          exportString: brushData.exportString,
        },
      },
      this.generateCells
    );
  }

  loadBrushFromDb(type, name) {
    const brushData =
      type === 'custom'
        ? brushesHandler.loadCustomBrush(name)
        : brushesLibrary[name];
    this.loadBrush(brushData, type);
  }

  onResize() {
    // Prevent displaying the resize Grid prompt if the user mobile
    // virtual keyboard is showing up (which trigger a resize event)
    if (
      utils.getDeviceType() === 'mobile' &&
      this.windowWidth === window.innerWidth
    )
      return;
    this.windowWidth = window.innerWidth;
    utils.initGridData(this.state.cellSize, true);
    // Redraw the svg with the new size
    this.changeCellSize(undefined);
  }

  handleMouseActions(event) {
    // Prevent mouse events (mousedown & mousemove) to trigger immediatly after
    // a 'touchstart' but allow mixed devices (mouse and touch) to use both type
    // of inputs separately
    if (event.type === 'touchstart') {
      this.lastTouchedTime = new Date();
    } else if (event.type === 'mousedown' || event.type === 'mousemove') {
      if (this.lastTouchedTime) {
        if (new Date() - this.lastTouchedTime < 750) {
          return event.preventDefault();
        }
      }
    }
    const isTouchEvent =
      event.type === 'touchstart' ||
      event.type === 'touchmove' ||
      event.type === 'touchend';
    const isMouseEvent =
      event.type === 'mousedown' ||
      event.type === 'mousemove' ||
      event.type === 'mouseup';
    const svgWidth = Math.floor(this.svg.width / this.pixelRatio);
    const svgHeight = Math.floor(this.svg.height / this.pixelRatio);
    // [SAFARI BUG] event.buttons not recognized
    // https://github.com/facebook/react/issues/7122
    const buttonPressedCode =
      event.type === 'mouseup'
        ? event.button === 0
          ? Mouse.LEFT_BUTTON
          : Mouse.MIDDLE_BUTTON
        : event.buttons !== undefined
        ? event.buttons
        : event.nativeEvent.which;
    let x, y;
    const { left, top } = this.svg.getBoundingClientRect();
    if (isMouseEvent) {
      x = event.pageX - left;
      y = event.pageY - top;
    } else if (isTouchEvent) {
      x = event.touches[0].clientX - left;
      y = event.touches[0].clientY - top;
    }
    // Prevent dragging overflowing out of the svg
    if (x < 0 || x > svgWidth || y < 0 || y > svgHeight) {
      return;
    }
    x -= this.state.shiftCoord.x;
    y -= this.state.shiftCoord.y;

    if (buttonPressedCode === Mouse.MIDDLE_BUTTON)
      this.panning[event.type](event);
    else
      this.tools[this.state.currentLayer][event.type](
        buttonPressedCode,
        x,
        y,
        event
      );
  }

  updateCellContent(col, row, content, callback) {
    const { currentLayer, grid } = this.state;
    const cellIndex = utils.findCellIndex(grid[currentLayer], col, row);
    if (cellIndex === -1) {
      const newCell = {
        col,
        row,
        content,
      };
      this.setState(
        prevState => {
          return {
            col,
            row,
            grid: {
              ...grid,
              [currentLayer]: [...grid[currentLayer], newCell],
            },
            displayGrid: {
              ...grid,
              [currentLayer]: [...grid[currentLayer], newCell],
            },
            activeGrid: {
              ...prevState.activeGrid,
              exportString: undefined,
            },
          };
        },
        () => {
          if (callback) {
            callback();
          }
        }
      );
    } else {
      this.setState(
        prevState => {
          return {
            col,
            row,
            grid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, cellIndex),
                {
                  ...grid[currentLayer][cellIndex],
                  content: {
                    ...grid[currentLayer][cellIndex].content,
                    ...content,
                  },
                },
                ...grid[currentLayer].slice(cellIndex + 1),
              ],
            },
            displayGrid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, cellIndex),
                {
                  ...grid[currentLayer][cellIndex],
                  content: {
                    ...grid[currentLayer][cellIndex].content,
                    ...content,
                  },
                },
                ...grid[currentLayer].slice(cellIndex + 1),
              ],
            },
            activeGrid: {
              ...prevState.activeGrid,
              exportString: undefined,
            },
          };
        },
        () => {
          if (callback) {
            callback();
          }
        }
      );
    }
  }

  removeCell(col, row, callback) {
    const { currentLayer, grid } = this.state;
    const cellIndex = utils.findCellIndex(grid[currentLayer], col, row);
    if (cellIndex === -1) {
      return;
    } else {
      this.setState(
        prevState => {
          return {
            col,
            row,
            grid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, cellIndex),
                ...grid[currentLayer].slice(cellIndex + 1),
              ],
            },
            displayGrid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, cellIndex),
                ...grid[currentLayer].slice(cellIndex + 1),
              ],
            },
            activeGrid: {
              ...prevState.activeGrid,
              exportString: undefined,
            },
          };
        },
        () => {
          if (callback) {
            callback();
          }
        }
      );
    }
  }

  updateDisplayCellContent(col, row, content) {
    const { currentLayer, grid } = this.state;
    const cellIndex = utils.findCellIndex(grid[currentLayer], col, row);
    if (cellIndex === -1) {
      const newCell = {
        col,
        row,
        content,
      };
      this.setState({
        col,
        row,
        displayGrid: {
          ...grid,
          [currentLayer]: [...grid[currentLayer], newCell],
        },
      });
    } else {
      this.setState(prevState => ({
        col,
        row,
        displayGrid: {
          ...grid,
          [currentLayer]: [
            ...grid[currentLayer].slice(0, cellIndex),
            {
              ...grid[currentLayer][cellIndex],
              content,
            },
            ...grid[currentLayer].slice(cellIndex + 1),
          ],
        },
      }));
    }
  }

  handleZoom(event) {
    const sign = event.deltaY > 0 ? -1 : 1;
    const delta = sign * 0.07 * this.state.cellSize;
    const newCellSize = this.state.cellSize + delta;
    if (event.deltaY < 0) {
      const shiftCoord = {
        x:
          this.state.shiftCoord.x - 0.1 * (event.pageX - window.innerWidth / 2),
        y:
          this.state.shiftCoord.y -
          0.1 * (event.pageY - window.innerHeight / 2),
      };
      this.setState(
        {
          shiftCoord,
        },
        () => {}
      );
      this.changeCellSize(newCellSize);
    } else {
      this.changeCellSize(newCellSize);
    }
  }

  handleMouseLeave() {
    const { currentLayer, grid } = this.state;
    this.setState({
      displayGrid: {
        ...grid,
        [currentLayer]: [...grid[currentLayer]],
      },
    });
  }

  switchShowGridlines() {
    let value;
    this.setState(
      prevState => {
        value = { showGridlines: !prevState.showGridlines };
        return value;
      },
      () => {
        config.save(value);
      }
    );
  }

  switchShowLayer(layerName) {
    this.setState(prevState => ({
      showLayers: {
        ...prevState.showLayers,
        [layerName]: !prevState.showLayers[layerName],
      },
    }));
  }

  handleCustomColorChange(color) {
    let value;
    this.setState(
      prevState => {
        return (value = { customColor: color.rgb });
      },
      () => {
        config.save(value);
      }
    );
  }

  handlePanningChange(isPanning, shiftCoord) {
    this.setState({
      isPanning,
      shiftCoord,
    });
  }

  handleCoordChange(coord) {
    this.setState({
      col: coord.col,
      row: coord.row,
    });
  }

  componentWillMount() {
    this.setState({
      grid: utils.createGrid(),
      displayGrid: utils.createGrid(),
      showLayers: utils.createShowLayers(),
      //TODO move to config?
      currentBrush: 'g1',
      currentLayer: 'lgrid',
    });
  }

  componentDidMount() {
    notif.init(this.refs.notificationSystem);
    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize, { passive: true });
    // Get grids library & set it in memory
    fetch(new Request('gridsLibrary.json'))
      .then(response => response.json())
      .then(response => {
        let gridsLibraryNames = Object.keys(response);
        gridsLibraryNames.unshift('Load a grid');
        gridsLibrary = response;
        this.setState({ gridsLibraryNames }, () => {
          // Restore active grid
          if (configData.activeGrid !== null)
            this.loadGridFromDb(
              configData.activeGrid.type,
              configData.activeGrid.name
            );
        });
      });
  }

  render() {
    const wrapperWidth = utils.getWrapperWidth();
    const wrapperHeight = utils.getWrapperHeight();
    const svgStyle =
      this.pixelRatio > 1
        ? { width: `${wrapperWidth}px`, height: `${wrapperHeight}px` }
        : {};
    const gridPathData = `M ${this.state.cellSize} 0 L 0 0 0 ${
      this.state.cellSize
    }`;
    return (
      <div
        className="main-wrapper"
        style={{
          backgroundColor: colorThemes[this.state.colorTheme].background,
        }}
      >
        <script>
          var cell = document.querySelector("button"); document.getElementById()
          (baseElement.querySelector("div span").innerHTML);
        </script>
        <div id="tooltip" className="tooltip">
          <span className="tooltip-text">Tooltip text</span>
        </div>
        <svg
          id="grid"
          className={`${this.state.isPanning ? 'panning' : ''}`}
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          width={wrapperWidth * this.pixelRatio}
          height={wrapperHeight * this.pixelRatio}
          style={svgStyle}
          ref={svg => (this.svg = svg)}
          onMouseMove={this.handleMouseActions}
          onMouseDown={this.handleMouseActions}
          onMouseUp={this.handleMouseActions}
          onMouseLeave={this.handleMouseLeave}
          onTouchStart={this.handleMouseActions}
          onTouchMove={this.handleMouseActions}
          onTouchEnd={this.handleMouseActions}
          onWheel={this.handleZoom}
        >
          <defs>
            <pattern
              x={this.state.shiftCoord.x}
              y={this.state.shiftCoord.y}
              id="grid-pattern"
              width={this.state.cellSize}
              height={this.state.cellSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={gridPathData}
                fill="none"
                stroke="white"
                strokeWidth={this.state.borderSize}
              />
            </pattern>
          </defs>
          {Object.keys(this.state.grid).map(layerName => {
            return configData.layers[layerName].map(toolName => {
              if (configData.symbols[toolName] !== undefined)
                return configData.symbols[toolName](this.state.customColor);
              return null;
            });
          })}

          {this.state.showGridlines ? (
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          ) : null}
          {Object.keys(this.state.displayGrid).map(layerName => {
            if (!this.state.showLayers[layerName]) return null;
            return (
              <Layer
                key={layerName}
                name={layerName}
                cellSize={this.state.cellSize}
                cells={this.state.displayGrid[layerName]}
                shiftCoord={this.state.shiftCoord}
              />
            );
          })}
        </svg>
        <Controls
          resetGrid={this.resetGrid}
          showGridlines={this.state.showGridlines}
          customColor={this.state.customColor}
          switchShowGridlines={this.switchShowGridlines}
          switchShowLayer={this.switchShowLayer}
          randomSeed={this.state.randomSeed}
          changeTimeCompression={this.changeTimeCompression}
          cellSize={this.state.cellSize}
          borderSize={this.state.borderSize}
          changeCellSize={this.changeCellSize}
          changeBorderSize={this.changeBorderSize}
          loadBrushFromDb={this.loadBrushFromDb}
          saveGrid={this.saveGrid}
          importGrid={this.importGrid}
          downloadGrid={this.downloadGrid}
          loadGridFromDb={this.loadGridFromDb}
          importBrush={this.importBrush}
          activeGrid={this.state.activeGrid}
          gridsLibraryNames={this.state.gridsLibraryNames}
          colorTheme={this.state.colorTheme}
          changeColorTheme={this.changeColorTheme}
          modalStyle={this.state.modalStyle}
          changeBrush={this.changeBrush}
          col={this.state.col}
          row={this.state.row}
          currentLayer={this.state.currentLayer}
          currentBrush={this.state.currentBrush}
          showLayers={this.state.showLayers}
          handleCustomColorChange={this.handleCustomColorChange}
        />
        <Footer
          colorTheme={this.state.colorTheme}
          modalStyle={this.state.modalStyle}
        />
        <Panning
          ref={panning => (this.panning = panning)}
          isPanning={this.state.isPanning}
          shiftCoord={this.state.shiftCoord}
          onChange={this.handlePanningChange}
        />
        <PatchTool
          ref={tool => (this.tools['lgrid'] = tool)}
          cellSize={this.state.cellSize}
          currentBrush={this.state.currentBrush}
          updateCellContent={this.updateCellContent}
          updateDisplayCellContent={this.updateDisplayCellContent}
        />
        <PatchTool
          ref={tool => (this.tools['lfloor'] = tool)}
          cellSize={this.state.cellSize}
          currentBrush={this.state.currentBrush}
          updateCellContent={this.updateCellContent}
          updateDisplayCellContent={this.updateDisplayCellContent}
        />
        <PatchTool
          ref={tool => (this.tools['lfloorm'] = tool)}
          cellSize={this.state.cellSize}
          currentBrush={this.state.currentBrush}
          updateCellContent={this.updateCellContent}
          updateDisplayCellContent={this.updateDisplayCellContent}
        />
        <BackstitchTool
          ref={tool => (this.tools['lwallv'] = tool)}
          cellSize={this.state.cellSize}
          currentBrush={this.state.currentBrush}
          onCoordChange={this.handleCoordChange}
          updateCellContent={this.updateCellContent}
        />
        <BackstitchTool
          ref={tool => (this.tools['lwallvm'] = tool)}
          cellSize={this.state.cellSize}
          currentBrush={this.state.currentBrush}
          onCoordChange={this.handleCoordChange}
          updateCellContent={this.updateCellContent}
        />
        <TextTool
          ref={tool => (this.tools['lnotes'] = tool)}
          cellSize={this.state.cellSize}
          currentBrush={this.state.currentBrush}
          layer={this.state.grid.lnotes}
          shiftCoord={this.state.shiftCoord}
          onCoordChange={this.handleCoordChange}
          removeCell={this.removeCell}
          updateCellContent={this.updateCellContent}
          modalStyle={this.state.modalStyle}
        />
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}

export default App;
