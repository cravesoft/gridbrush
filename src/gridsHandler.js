const gridsHandler = {
  saveUserGrid: options => {
    let userGrids = gridsHandler.getUserGrids();
    let newUserGrids = userGrids ? userGrids : {};
    newUserGrids[options.name] = options;
    const exportString = gridsHandler.encodeGridExportString(
      newUserGrids[options.name]
    );
    newUserGrids[options.name].exportString = exportString;
    localStorage.setItem('userGrids', JSON.stringify(newUserGrids));
  },

  importUserGrid: (gridData, gridExportString) => {
    let userGrids = gridsHandler.getUserGrids();
    let newUserGrids = userGrids ? userGrids : {};
    newUserGrids[gridData.name] = gridData;
    newUserGrids[gridData.name].exportString = gridExportString;
    localStorage.setItem('userGrids', JSON.stringify(newUserGrids));
  },

  // Generate a grid export string by encoding grid data to a base64 string
  encodeGridExportString: gridData =>
    btoa(unescape(encodeURIComponent(JSON.stringify(gridData)))),

  decodeGridExportString: exportString => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(exportString))));
    } catch (e) {
      // If corrupted Base64 string, return undefined
      return undefined;
    }
  },

  loadUserGrid: name => {
    const userGrids = gridsHandler.getUserGrids();
    return userGrids ? userGrids[name] : null;
  },

  deleteUserGrid: name => {
    const userGrids = gridsHandler.getUserGrids();
    // If only one grid delete userGrids from localStorage
    if (Object.keys(userGrids).length === 1) {
      localStorage.removeItem('userGrids');
      return 'noGridLeft';
    }
    delete userGrids[name];
    localStorage.setItem('userGrids', JSON.stringify(userGrids));
  },

  doesImportGridAlreadyExist: gridExportString => {
    const userGrids = gridsHandler.getUserGrids();
    for (let grid in userGrids) {
      if (userGrids[grid].exportString === gridExportString) {
        return userGrids[grid].name;
      }
    }
    return false;
  },

  getUserGrids: () => JSON.parse(localStorage.getItem('userGrids')),

  getUserGridsNames: () => {
    const userGrids = gridsHandler.getUserGrids();
    if (userGrids) {
      let userGridsNames = Object.keys(userGrids);
      userGridsNames.unshift('Load a grid');
      return userGridsNames;
    }
    return null;
  },
};

export default gridsHandler;
