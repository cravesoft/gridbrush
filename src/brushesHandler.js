import utils from './utils';

const brushesHandler = {
  saveCustomBrush: options => {
    let customBrushes = brushesHandler.getCustomBrushes();
    let newCustomBrushes = customBrushes ? customBrushes : {};
    let brushData = brushesHandler.getBrushLifeMapAndSize(
      options.gridSize,
      options.indexChanged
    );
    newCustomBrushes[options.name] = {
      name: options.name,
      brushSize: brushData.size,
      lifeMap: brushData.lifeMap,
    };
    const exportString = brushesHandler.encodeBrushExportString(
      newCustomBrushes[options.name]
    );
    newCustomBrushes[options.name].exportString = exportString;
    localStorage.setItem('customBrushes', JSON.stringify(newCustomBrushes));
  },

  importCustomBrush: (brushData, brushExportString) => {
    let customBrushes = brushesHandler.getCustomBrushes();
    let newCustomBrushes = customBrushes ? customBrushes : {};
    newCustomBrushes[brushData.name] = brushData;
    newCustomBrushes[brushData.name].exportString = brushExportString;
    localStorage.setItem('customBrushes', JSON.stringify(newCustomBrushes));
  },

  // Generate a brush export string by encoding brush data to a base64 string
  encodeBrushExportString: brushData =>
    btoa(unescape(encodeURIComponent(JSON.stringify(brushData)))),

  decodeBrushExportString: exportString => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(exportString))));
    } catch (e) {
      // If corrupted Base64 string, return undefined
      return undefined;
    }
  },

  loadCustomBrush: name => {
    const customBrushes = brushesHandler.getCustomBrushes();
    return customBrushes ? customBrushes[name] : null;
  },

  deleteCustomBrush: name => {
    const customBrushes = brushesHandler.getCustomBrushes();
    // If only one brush delete customBrushes from localStorage
    if (Object.keys(customBrushes).length === 1) {
      localStorage.removeItem('customBrushes');
      return 'noBrushLeft';
    }
    delete customBrushes[name];
    localStorage.setItem('customBrushes', JSON.stringify(customBrushes));
  },

  doesImportBrushAlreadyExist: brushExportString => {
    const customBrushes = brushesHandler.getCustomBrushes();
    for (let brush in customBrushes) {
      if (customBrushes[brush].exportString === brushExportString) {
        return customBrushes[brush].name;
      }
    }
    return false;
  },

  getCustomBrushes: () => JSON.parse(localStorage.getItem('customBrushes')),

  getCustomBrushesNames: () => {
    const customBrushes = brushesHandler.getCustomBrushes();
    if (customBrushes) {
      let customBrushesNames = Object.keys(customBrushes);
      customBrushesNames.unshift('Load a brush');
      return customBrushesNames;
    }
    return null;
  },

  getBrushLifeMapAndSize: (gridSize, indexChanged) => {
    let lifeMap = utils.generateSeed();
    let colLength = gridSize[0];
    let rowLength = gridSize[1];
    indexChanged.forEach((el, i) => {
      lifeMap[el] = lifeMap[el] ? 0 : 1;
    });
    let gridMap = {};
    let activeGridRow = -1;

    // Create an 'hashMap' of the actual lifeMap with rows
    // as keys containing the cols
    for (let i = 0; i < lifeMap.length; i++) {
      if (!(i % colLength)) {
        activeGridRow += 1;
        gridMap[activeGridRow] = [];
      }
      gridMap[activeGridRow].push(lifeMap[i]);
    }

    let widthStart, widthEnd, heightStart, heightEnd;
    // Detect the cell Alive the most on the left and right
    // of the actual brush
    for (let i = 0; i < rowLength; i++) {
      let widthStartSetForActualRow = false;
      // If no cell alive on the actual row, continue
      if (gridMap[i].indexOf(1) === -1) continue;
      // Set the first row of the brush
      if (heightStart === undefined) heightStart = i;
      // Set the last row of the brush
      if (heightEnd === undefined || i > heightEnd) heightEnd = i;
      // Iterate on each col cell of the current row
      for (let j = 0; j < gridMap[i].length; j++) {
        if (!widthStartSetForActualRow) {
          // If the cell is alive and under the actual
          // saved widthStart
          if (gridMap[i][j] && (widthStart === undefined || j < widthStart)) {
            widthStart = j;
            widthStartSetForActualRow = true;
          }
        }
        // If the cell is alive and under the actual
        // saved widthEnd
        if (gridMap[i][j] && (widthEnd === undefined || j > widthEnd)) {
          widthEnd = j;
        }
      }
    }

    let brushWidth = widthStart !== undefined ? widthEnd - widthStart + 1 : 0;
    let brushHeight =
      heightStart !== undefined ? heightEnd - heightStart + 1 : 0;
    let widthDiff = gridSize[0] - brushWidth;
    let brushlifeMap = indexChanged.map(el => {
      // remove previous row
      let newIndex = el - widthDiff * Math.floor(el / gridSize[0]);
      newIndex -= widthStart;
      newIndex -= brushWidth * heightStart;
      return newIndex;
    });

    return {
      size: [brushWidth, brushHeight],
      lifeMap: brushlifeMap,
    };
  },
};

export default brushesHandler;
