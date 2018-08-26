import React, { Component } from 'react';
import FileSaver from 'file-saver';
import config from './config/configHandler';
import colorThemes from './config/colorThemes';
import utils from './utils';
import Controls from './controls/Controls';
import Footer from './Footer';
import Layer from './grid/Layer';
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
      displacement: { x: 0, y: 0 },
    };
    this.startPanCoord = null;
    this.startPanDisplacement = null;
    this.currentPos = 'center';
    this.pixelRatio = window.devicePixelRatio;
    this.currentIndexChanged = {};
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
    this.handleCellChangeState = this.handleCellChangeState.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.stopClickDrag = this.stopClickDrag.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.switchShowGridlines = this.switchShowGridlines.bind(this);
    this.switchShowLayer = this.switchShowLayer.bind(this);
    this.handleCustomColorChange = this.handleCustomColorChange.bind(this);
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
        displacement: { x: 0, y: 0 },
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
      this.changeCellSize(newCellValues);
      notif.clearAll();
      notif.cellSizeChanged();
    }
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

  updateNeighbor(gridName, grid, newCell) {
    const { currentLayer } = this.state;
    const i = utils.findCellIndex(grid[currentLayer], newCell.col, newCell.row);
    if (i === -1) return;
    newCell.content = {
      ...grid[currentLayer][i].content,
      ...newCell.content,
    };
    this.setState({
      [gridName]: {
        ...grid,
        [currentLayer]: [
          ...grid[currentLayer].slice(0, i),
          newCell,
          ...grid[currentLayer].slice(i + 1),
        ],
      },
    });
  }

  handleCellChangeState(event) {
    // Prevent mouse events (mousedown & mousemove) to trigger immediatly after a 'touchstart'
    // but allow mixed devices (mouse and touch) to use both type of inputs separately
    if (event.type === 'touchstart') {
      this.lastTouchedTime = new Date();
    } else if (event.type === 'mousedown' || event.type === 'mousemove') {
      if (this.lastTouchedTime) {
        if (new Date() - this.lastTouchedTime < 750) {
          return event.preventDefault();
        }
      }
    }
    const { currentLayer, currentBrush, grid } = this.state;
    const pointerType = utils.getPointerType(event.type);
    const moveEvent = pointerType === 'touch' ? 'touchmove' : 'mousemove';
    const isTouchEvent =
      event.type === 'touchstart' || event.type === 'touchmove';
    const svgWidth = Math.floor(this.svg.width / this.pixelRatio);
    const svgHeight = Math.floor(this.svg.height / this.pixelRatio);
    // [SAFARI BUG] event.buttons not recognized
    // https://github.com/facebook/react/issues/7122
    const buttonPressedCode =
      event.buttons !== undefined ? event.buttons : event.nativeEvent.which;
    let x, y;
    const { left, top } = this.svg.getBoundingClientRect();
    if (event.type === 'mousedown' || event.type === 'mousemove') {
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
    if (buttonPressedCode === 4) {
      if (event.type === 'mousedown') {
        this.startPanCoord = {
          x: event.pageX,
          y: event.pageY,
        };
        this.startPanDisplacement = this.state.displacement;
        this.setState({
          isPanning: true,
        });
      } else if (event.type === 'mousemove') {
        const displacement = {
          x: this.startPanDisplacement.x + event.pageX - this.startPanCoord.x,
          y: this.startPanDisplacement.y + event.pageY - this.startPanCoord.y,
        };
        this.setState({
          isPanning: true,
          displacement,
        });
      }
      return event.preventDefault();
    }
    x -= this.state.displacement.x;
    y -= this.state.displacement.y;
    let cellSize = this.state.cellSize;
    let col = Math.floor(x / cellSize);
    let row = Math.floor(y / cellSize);
    const cellIndex = row * utils.getColSize() + col;
    let neighborIndex = null;
    let neighborPos = null;
    if (currentLayer === 'lwallv' || currentLayer === 'lwallvm') {
      if (buttonPressedCode !== 1) {
        let diff = x % cellSize;
        if (diff < 5) {
          this.currentPos = 'left';
        } else if (cellSize - diff < 5) {
          this.currentPos = 'right';
        } else {
          diff = y % cellSize;
          if (diff < 5) {
            this.currentPos = 'top';
          } else if (cellSize - diff < 5) {
            this.currentPos = 'bottom';
          }
        }
      } else {
        let diff = x % cellSize;
        if (diff < 5 && this.currentPos === 'right') {
          this.currentPos = 'left';
        } else if (cellSize - diff < 5 && this.currentPos === 'left') {
          this.currentPos = 'right';
        } else {
          diff = y % cellSize;
          if (diff < 5 && this.currentPos === 'bottom') {
            this.currentPos = 'top';
          } else if (cellSize - diff < 5 && this.currentPos === 'top') {
            this.currentPos = 'bottom';
          }
        }
      }
      neighborIndex = utils.getNeighborIndex(cellIndex, this.currentPos);
      neighborPos =
        this.currentPos === 'top'
          ? 'bottom'
          : this.currentPos === 'bottom'
            ? 'top'
            : this.currentPos === 'left'
              ? 'right'
              : 'left';
    } else {
      this.currentPos = 'center';
    }
    // if mouse over the svg but not clicking
    const newCell = {
      col: col,
      row: row,
      content: {
        [this.currentPos]: currentBrush,
      },
    };
    const newNeighborCell = {
      col: neighborIndex % utils.getColSize(),
      row: Math.floor(neighborIndex / utils.getColSize()),
      content: {
        [neighborPos]: undefined,
      },
    };
    if (event.type === 'mousemove' && buttonPressedCode !== 1) {
      let i = utils.findCellIndex(grid[currentLayer], col, row);
      if (i !== -1) {
        newCell.content = {
          ...grid[currentLayer][i].content,
          ...newCell.content,
        };
        this.setState(
          {
            col,
            row,
            displayGrid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, i),
                newCell,
                ...grid[currentLayer].slice(i + 1),
              ],
            },
          },
          () => {
            if (neighborIndex)
              this.updateNeighbor(
                'displayGrid',
                this.state.displayGrid,
                newNeighborCell
              );
          }
        );
      } else {
        this.setState(
          {
            col,
            row,
            displayGrid: {
              ...grid,
              [currentLayer]: [...grid[currentLayer], newCell, newNeighborCell],
            },
          },
          () => {
            if (neighborIndex)
              this.updateNeighbor(
                'displayGrid',
                this.state.displayGrid,
                newNeighborCell
              );
          }
        );
      }
      return;
    }

    if (event.type === moveEvent) {
      // Don't switch a cell multiple times or cell with the
      // same state as the new one changed
      if (
        this.currentIndexChanged.hasOwnProperty(cellIndex) ||
        this.state.grid[currentLayer][cellIndex] === currentBrush
      ) {
        return;
      }

      this.currentIndexChanged[cellIndex] = true;
    }
    if (buttonPressedCode !== 1) {
      return event.preventDefault();
    }
    let i = utils.findCellIndex(grid[currentLayer], col, row);
    if (i !== -1) {
      newCell.content = {
        ...grid[currentLayer][i].content,
        ...newCell.content,
      };
      this.setState(
        prevState => {
          return {
            col,
            row,
            grid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, i),
                newCell,
                ...grid[currentLayer].slice(i + 1),
              ],
            },
            displayGrid: {
              ...grid,
              [currentLayer]: [
                ...grid[currentLayer].slice(0, i),
                newCell,
                ...grid[currentLayer].slice(i + 1),
              ],
            },
            activeGrid: {
              ...prevState.activeGrid,
              exportString: undefined,
            },
          };
        },
        () => {
          if (neighborIndex)
            this.updateNeighbor('grid', this.state.grid, newNeighborCell);
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
          if (neighborIndex)
            this.updateNeighbor('grid', this.state.grid, newNeighborCell);
        }
      );
    }
  }

  handleZoom(event) {
    const sign = event.deltaY > 0 ? -1 : 1;
    const delta = sign * 0.07 * this.state.cellSize;
    const newCellSize = this.state.cellSize + delta;
    if (event.deltaY < 0) {
      const displacement = {
        x:
          this.state.displacement.x -
          0.1 * (event.pageX - window.innerWidth / 2),
        y:
          this.state.displacement.y -
          0.1 * (event.pageY - window.innerHeight / 2),
      };
      this.setState(
        {
          displacement,
        },
        () => {}
      );
      this.changeCellSize(newCellSize);
    } else {
      this.changeCellSize(newCellSize);
    }
  }

  stopClickDrag() {
    this.currentIndexChanged = {};
    this.setState({
      isPanning: false,
    });
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
          onMouseMove={this.handleCellChangeState}
          onMouseDown={this.handleCellChangeState}
          onMouseUp={this.stopClickDrag}
          onMouseLeave={this.handleMouseLeave}
          onTouchStart={this.handleCellChangeState}
          onTouchMove={this.handleCellChangeState}
          onTouchEnd={this.stopClickDrag}
          onWheel={this.handleZoom}
        >
          <defs>
            <pattern
              x={this.state.displacement.x}
              y={this.state.displacement.y}
              id="grid-pattern"
              width={this.state.cellSize}
              height={this.state.cellSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={gridPathData}
                fill="none"
                stroke="gray"
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

          {Object.keys(this.state.displayGrid).map(layerName => {
            if (!this.state.showLayers[layerName]) return null;
            return (
              <Layer
                key={layerName}
                name={layerName}
                cellSize={this.state.cellSize}
                cells={this.state.displayGrid[layerName]}
                displacement={this.state.displacement}
              />
            );
          })}
          {this.state.showGridlines ? (
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          ) : null}
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
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}

export default App;
