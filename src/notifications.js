let notif;
const displayNotification = options =>
  notif.addNotification({
    title: options.title,
    message: options.message,
    position: options.position || 'bc',
    level: options.level || 'info',
    autoDismiss: options.autoDismiss || 4,
    action: options.action || null,
  });
const isNotificationAlreadyOpen = title => {
  if (notif.state.notifications.length) {
    for (let i = 0; i < notif.state.notifications.length; i++) {
      if (notif.state.notifications[i].title === title) return true;
    }
  }
  return false;
};

export default {
  init: notificationSystem => (notif = notificationSystem),

  clearAll: () => notif.clearNotifications(),

  /* APP */
  cellSizeChanged: () =>
    displayNotification({
      title: 'Cell size changed',
      message: 'The cell size has changed to adapt to the grid size.',
    }),

  gridLoadedAndSaved: () =>
    displayNotification({
      title: 'Grid loaded',
      message:
        'The grid has been successfully loaded and saved in your grid library.',
      level: 'success',
      autoDismiss: 6,
    }),

  cellSizeTooBig: () =>
    displayNotification({
      title: 'Cell is too big',
      message: 'Please reduce the cell size.',
      level: 'error',
    }),

  resizeGridPrompt: callback => {
    const title = 'Window size changed';
    if (!isNotificationAlreadyOpen(title)) {
      return displayNotification({
        title: title,
        message: 'Do you want to adapt the grid size to your new window size?',
        level: 'info',
        action: { label: 'Resize grid', callback },
      });
    }
  },

  /* CONTROLS */
  cantSaveBrush: message =>
    displayNotification({
      title: "Can't save brush",
      message,
      level: 'warning',
      autoDismiss: 6,
    }),

  /* MANAGE BRUSH MODAL */
  brushSuccessfullyLoaded: () =>
    displayNotification({
      title: 'Brush successfully loaded',
      message: 'The brush has been successfully loaded in the grid.',
      level: 'success',
    }),

  brushLinkCopied: () =>
    displayNotification({
      title: 'Brush link copied',
      message: 'The brush link has been copied into your clipboard.',
      level: 'success',
    }),

  brushLinkNotCopied: error =>
    displayNotification({
      title: "Brush link can't be copied",
      message: `Error while copying the brush link into your clipboard. Error: ${error}`,
      level: 'error',
    }),

  /* IMPORT BRUSH MODAL */
  wrongBrushExportString: () =>
    displayNotification({
      title: 'Wrong brush export string',
      message: 'The brush export string you have entered is invalid.',
      level: 'error',
    }),

  brushAlreadyExists: brushName =>
    displayNotification({
      title: 'This brush already exists',
      message: `The brush you trying to import already exists with the name: ${brushName}.`,
      level: 'warning',
    }),

  brushSuccessfullyImported: brushName =>
    displayNotification({
      title: 'Brush successfully imported',
      message:
        'The brush has been successfully imported and saved in your custom brush library.',
      level: 'success',
    }),

  /* MANAGE GRID MODAL */
  gridSuccessfullyLoaded: () =>
    displayNotification({
      title: 'Grid successfully loaded',
      message: 'The grid has been successfully loaded.',
      level: 'success',
    }),

  gridLinkCopied: () =>
    displayNotification({
      title: 'Grid link copied',
      message: 'The grid link has been copied into your clipboard.',
      level: 'success',
    }),

  gridLinkNotCopied: error =>
    displayNotification({
      title: "Grid link can't be copied",
      message: `Error while copying the grid link into your clipboard. Error: ${error}`,
      level: 'error',
    }),

  /* IMPORT GRID MODAL */
  wrongGridExportString: () =>
    displayNotification({
      title: 'Wrong grid export string',
      message: 'The grid export string you have entered is invalid.',
      level: 'error',
    }),

  gridAlreadyExists: gridName =>
    displayNotification({
      title: 'This grid already exists',
      message: `The grid you trying to import already exists with the name: ${gridName}.`,
      level: 'warning',
    }),

  gridSuccessfullyImported: gridName =>
    displayNotification({
      title: 'Grid successfully imported',
      message:
        'The grid has been successfully imported and saved in your grid library.',
      level: 'success',
    }),
};
