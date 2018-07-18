import config from './config/configHandler';
const configData = config.get();
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const bodyPaddingX = configData.bodyPaddingX;
const bodyPaddingY = configData.bodyPaddingY;
let roundedCol,
  roundedRow,
  wrapperWidth,
  wrapperHeight,
  colSize,
  rowSize,
  cellsCount;

export default {
  initGridData: (cellSize, isResize) => {
    if (isResize) {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    }
    roundedCol = Math.floor((windowWidth - bodyPaddingX * 2) / cellSize);
    roundedRow = Math.floor((windowHeight - bodyPaddingY * 2) / cellSize);
    wrapperWidth = roundedCol * cellSize;
    wrapperHeight = roundedRow * cellSize;
    colSize = roundedCol;
    rowSize = Math.floor(wrapperHeight / cellSize);
    cellsCount = rowSize * colSize;
  },

  // Predict if the grid will have enough space to paint
  // at least one cell when changing cell size
  gridHasCells: newCellSize => {
    const newRoundedCol = Math.floor(
      (windowWidth - bodyPaddingX * 2) / newCellSize
    );
    const newRoundedRow = Math.floor(
      (windowHeight - bodyPaddingY * 2) / newCellSize
    );
    return !!(newRoundedCol && newRoundedRow);
  },

  adaptGridSizeToGridSize: (gridSize, cellSize) => {
    let newGridSize = [colSize, rowSize];
    let newCellSize = cellSize;
    let newRoundedCol, newRoundedRow, newWrapperHeight, newRowSize;
    let gridTooBigWithSmallestCellSize = false;

    // Try adapating the canvas size by reducing the cell size and keeping
    // the actual border size
    while (
      !gridTooBigWithSmallestCellSize &&
      (newGridSize[0] < gridSize[0] || newGridSize[1] < gridSize[1])
    ) {
      if (newCellSize <= 2) {
        gridTooBigWithSmallestCellSize = true;
        break;
      }
      newCellSize -= 2;
      newRoundedCol = Math.floor(
        (windowWidth - bodyPaddingX * 2) / newCellSize
      );
      newRoundedRow = Math.floor(
        (windowHeight - bodyPaddingY * 2) / newCellSize
      );
      newWrapperHeight = newRoundedRow * newCellSize;
      newRowSize = Math.floor(newWrapperHeight / newCellSize);
      newGridSize = [newRoundedCol, newRowSize];
    }

    // If grid could be adapted to grid, return new cell values,
    // Else grid is too big to adapt the canvas, return null
    return !gridTooBigWithSmallestCellSize ? newCellSize : null;
  },

  createGrid: () => {
    let grid = {};
    const layers = Object.keys(configData.layers);
    for (let i = 0; i < layers.length; i++) {
      const layerName = layers[i];
      grid[layerName] = [];
    }
    return grid;
  },

  findCellIndex: (layer, col, row) => {
    return layer.findIndex(el => {
      return el.col === col && el.row === row;
    });
  },

  createShowLayers: () => {
    let showLayers = {};
    const layers = Object.keys(configData.layers);
    for (let i = 0; i < layers.length; i++) {
      const layerName = layers[i];
      showLayers[layerName] = true;
    }
    return showLayers;
  },

  // Add a comma every 3 figures
  formatDigits: totalCellsNumber =>
    totalCellsNumber.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),

  getTotalCells: () => cellsCount,

  getWrapperWidth: () => wrapperWidth,

  getWrapperHeight: () => wrapperHeight,

  getColSize: () => colSize,

  getGridSize: () => [colSize, rowSize],

  getSelectList: array =>
    array.reduce((acc, el) => {
      acc.push([el, el]);
      return acc;
    }, []),

  getPointerType: eventType =>
    eventType === 'touchstart' || eventType === 'touchmove' ? 'touch' : 'mouse',

  getDeviceType: () =>
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(
      navigator.userAgent
    )
      ? 'mobile'
      : 'desktop',

  //TODO remove?
  getNeighborsIndexes: index => {
    const position = index + 1;
    let neighborsIndexes = [];
    let xAxisBorder, yAxisBorder;
    // Detect if cell is on X or Y axis extremities
    if (position <= colSize) xAxisBorder = 'top';
    if (position > cellsCount - colSize) xAxisBorder = 'bottom';
    if (position % colSize === 1) yAxisBorder = 'left';
    if (position % colSize === 0) yAxisBorder = 'right';
    for (let i = 0; i < 8; i++) {
      switch (i) {
        default:
        case 0: // Top Row - Left
          break;
        case 1: // Top Row - Middle
          if (xAxisBorder !== 'top') {
            neighborsIndexes.push(index - colSize);
          }
          break;
        case 2: // Top Row - Right
          break;
        case 3: // Middle Row - Left
          if (yAxisBorder !== 'left') {
            neighborsIndexes.push(index - 1);
          }
          break;
        case 4: // Middle Row - Right
          if (yAxisBorder !== 'right') {
            neighborsIndexes.push(index + 1);
          }
          break;
        case 5: // Bottom Row - Left
          break;
        case 6: // Bottom Row - Middle
          if (xAxisBorder !== 'bottom') {
            neighborsIndexes.push(index + colSize);
          }
          break;
        case 7: // Bottom Row - Right
          break;
      }
    }
    return neighborsIndexes;
  },

  getNeighborIndex: (index, border) => {
    const position = index + 1;
    let xAxisBorder, yAxisBorder;
    // Detect if cell is on X or Y axis extremities
    if (position <= colSize) xAxisBorder = 'top';
    if (position > cellsCount - colSize) xAxisBorder = 'bottom';
    if (position % colSize === 1) yAxisBorder = 'left';
    if (position % colSize === 0) yAxisBorder = 'right';
    if (border === 'top' && xAxisBorder !== 'top') {
      return index - colSize;
    } else if (border === 'left' && yAxisBorder !== 'left') {
      return index - 1;
    } else if (border === 'right' && yAxisBorder !== 'right') {
      return index + 1;
    } else if (border === 'bottom' && xAxisBorder !== 'bottom') {
      return index + colSize;
    }
    return null;
  },

  getSVGString: svgNode => {
    const appendCSS = (cssText, element) => {
      var styleElement = document.createElement('style');
      styleElement.setAttribute('type', 'text/css');
      styleElement.innerHTML = cssText;
      var refNode = element.hasChildNodes() ? element.children[0] : null;
      element.insertBefore(styleElement, refNode);
    };

    const getCSSStyles = parentElement => {
      let selectorTextArr = [];

      // Add parent element id and classes to the list
      selectorTextArr.push(`#${parentElement.id}`);
      for (let c = 0; c < parentElement.classList.length; c++)
        if (!contains(`.${parentElement.classList[c]}`, selectorTextArr))
          selectorTextArr.push(`.${parentElement.classList[c]}`);

      // Add children element ids and classes to the list
      const nodes = parentElement.getElementsByTagName('*');
      for (let i = 0; i < nodes.length; i++) {
        const id = nodes[i].id;
        if (!contains(`#${id}`, selectorTextArr))
          selectorTextArr.push(`#${id}`);

        const classes = nodes[i].classList;
        for (let c = 0; c < classes.length; c++)
          if (!contains(`.${classes[c]}`, selectorTextArr))
            selectorTextArr.push(`.${classes[c]}`);
      }

      // Extract CSS rules
      let extractedCSSText = '';
      for (let i = 0; i < document.styleSheets.length; i++) {
        const s = document.styleSheets[i];

        try {
          if (!s.cssRules) continue;
        } catch (e) {
          if (e.name !== 'SecurityError') throw e; // for Firefox
          continue;
        }

        const cssRules = s.cssRules;
        for (let r = 0; r < cssRules.length; r++) {
          if (contains(cssRules[r].selectorText, selectorTextArr))
            extractedCSSText += cssRules[r].cssText;
        }
      }

      return extractedCSSText;

      function contains(str, arr) {
        return arr.indexOf(str) === -1 ? false : true;
      }
    };

    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    const cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);

    // Fix root xlink without namespace
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');

    // Safari NS namespace fix
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href');

    return svgString;
  },

  svgString2Image: (svgString, width, height, callback) => {
    // Convert SVG string to data URL
    const imgsrc =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgString)));

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    let image = new Image();
    image.onload = function() {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(blob => callback(blob));
    };
    image.src = imgsrc;
  },
};
