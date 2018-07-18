import React from 'react';

/* Default config */
export default {
  // Basic
  bodyPaddingX: 14,
  bodyPaddingY: 28,
  colorTheme: 'default (light)', // See './colorThemes.js'
  // Options
  isControlsOpen: true,
  isOptionsOpen: false,
  showGridlines: true,
  downloadFormat: 'svg',
  cellSizesList: [20, 30, 40, 50, 60],
  cellSize: 60,
  borderSizesList: [1, 2, 3, 4, 5, 6],
  customColor: 'white',
  borderSize: 1,
  // Modal style
  modalStyle: {
    overlay: { backgroundColor: 'rgba(0, 0, 0, .5)', zIndex: 1000 },
    content: {
      position: 'absolute',
      width: '260px',
      background: 'rgba(0,0,0,.75)',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      outline: 'none',
      padding: '15px',
    },
  },
  layers: {
    lgrid: [
      'eraser',
      'g1',
      'g2',
      'g3',
      'g4',
      'g5',
      'g6',
      'g7',
      'g8',
      'g9',
      'g10',
    ],
    lfloor: [
      'eraser',
      'f1',
      'f2',
      'f3',
      'f4',
      'f5',
      'f6',
      'f7',
      'f8',
      'f9',
      'f10',
      'f11',
      'f12',
      'f13',
    ],
    lfloorm: [
      'eraser',
      'fm1',
      'fm2',
      'fm3',
      'fm4',
      'fm5',
      'fm6',
      'fm7',
      'fm8',
      'fm9',
      'fm10',
      'fm11',
      'fm12',
      'fm13',
      'fm14',
      'fm15',
      'fm16',
    ],
    lwallv: ['eraser', 'w1v', 'w2v', 'w3v', 'w4v', 'w5v', 'w6v', 'w7v'],
    lwallvm: [
      'eraser',
      'wm1v',
      'wm2v',
      'wm3v',
      'wm4v',
      'wm5v',
      'wm6v',
      'wm7v',
      'wm8v',
      'wm9v',
    ],
    lnotes: ['eraser', 'ln1', 'ln2', 'ln3'],
  },
  text: {
    // Layer short names
    lgrid: 'grid',
    lfloor: 'floor',
    lfloorm: 'floor m',
    lwallv: 'wall',
    lwallvm: 'wall m',
    lnotes: 'notes',

    // Layer full names
    'lgrid-text': 'Grid (background)',
    'lfloor-text': 'Floor',
    'lfloorm-text': 'Floor markers',
    'lwallv-text': 'Wall',
    'lwallvm-text': 'Wall markers',
    'lnotes-text': 'Notes (text)',

    // Ground styles
    'lgrid-eraser': 'eraser',
    'lgrid-g1': 'light gray',
    'lgrid-g2': 'gray',
    'lgrid-g3': 'light blue',
    'lgrid-g4': 'blue',
    'lgrid-g5': 'light green',
    'lgrid-g6': 'green',
    'lgrid-g7': 'yellow',
    'lgrid-g8': 'brown',
    'lgrid-g9': 'red',
    'lgrid-g10': 'custom color',

    // Floor styles
    'lfloor-eraser': 'eraser',
    'lfloor-f1': 'wall 1',
    'lfloor-f2': 'wall 2',
    'lfloor-f3': 'secret wall',
    'lfloor-f4': 'door v',
    'lfloor-f5': 'door h',
    'lfloor-f6': 'pressure plate',
    'lfloor-f7': 'pit',
    'lfloor-f8': 'water',
    'lfloor-f9': 'stairs up',
    'lfloor-f10': 'stairs down',
    'lfloor-f11': 'exit',
    'lfloor-f12': 'fence',
    'lfloor-f13': 'magic',

    // Floor Mark styles
    'lfloorm-eraser': 'eraser',
    'lfloorm-fm1': 'x/lock',
    'lfloorm-fm2': 'arrow E',
    'lfloorm-fm3': 'arrow W',
    'lfloorm-fm4': 'arrow N',
    'lfloorm-fm5': 'arrow S',
    'lfloorm-fm6': '?',
    'lfloorm-fm7': '!',
    'lfloorm-fm8': 'chest',
    'lfloorm-fm9': 'quest',
    'lfloorm-fm10': 'battle',
    'lfloorm-fm11': 'key',
    'lfloorm-fm12': 'spinner',
    'lfloorm-fm13': 'teleport',
    'lfloorm-fm14': 'food',
    'lfloorm-fm15': 'tree',
    'lfloorm-fm16': 'house',

    // Wall styles
    'lwallv-eraser': 'eraser',
    'lwallv-w1v': 'wall',
    'lwallv-w2v': 'door',
    'lwallv-w3v': 'secret door',
    'lwallv-w4v': 'false wall',
    'lwallv-w5v': 'alcove R',
    'lwallv-w6v': 'alcove L',
    'lwallv-w7v': 'archway',

    // Wall Mark styles
    'lwallvm-eraser': 'eraser',
    'lwallvm-wm1v': 'x/lock',
    'lwallvm-wm2v': 'arrow R',
    'lwallvm-wm3v': 'arrow L',
    'lwallvm-wm4v': 'grate',
    'lwallvm-wm5v': 'button/lever R',
    'lwallvm-wm6v': 'button/lever L',
    'lwallvm-wm7v': 'keyhole',
    'lwallvm-wm8v': 'fountain R',
    'lwallvm-wm9v': 'fountain L',

    // Note styles
    'lnotes-eraser': 'eraser',
    'lnotes-ln1': 'centered',
    'lnotes-ln2': 'corner',
    'lnotes-ln3': 'label',
  },
  symbols: {
    selected: color => (
      <symbol key="selected" id="selected" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#999" />
      </symbol>
    ),
    g1: color => (
      <symbol key="g1" id="g1" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#999" />
      </symbol>
    ),
    g2: color => (
      <symbol key="g2" id="g2" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#666" />
      </symbol>
    ),
    g3: color => (
      <symbol key="g3" id="g3" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#7ea9ff" />
      </symbol>
    ),
    g4: color => (
      <symbol key="g4" id="g4" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#537bca" />
      </symbol>
    ),
    g5: color => (
      <symbol key="g5" id="g5" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#99ff99" />
      </symbol>
    ),
    g6: color => (
      <symbol key="g6" id="g6" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#5dc65d" />
      </symbol>
    ),
    g7: color => (
      <symbol key="g7" id="g7" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#ffff99" />
      </symbol>
    ),
    g8: color => (
      <symbol key="g8" id="g8" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#d2bc80" />
      </symbol>
    ),
    g9: color => (
      <symbol key="g9" id="g9" viewBox="0 0 1 1">
        <rect x="0" y="0" width="1" height="1" fill="#f99" />
      </symbol>
    ),
    g10: color => (
      <symbol key="g10" id="g10" viewBox="0 0 1 1">
        <rect
          x="0"
          y="0"
          width="1"
          height="1"
          fill={`rgb(${color.r}, ${color.g}, ${color.b})`}
          fillOpacity={color.a}
        />
      </symbol>
    ),
    f1: color => (
      <symbol key={'f1'} id={'f1'} viewBox="0 0 30 30">
        <g
          stroke="black"
          strokeWidth="1.1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <line x1="-25" y1="30" x2="5" y2="0" />
          <line x1="-20" y1="30" x2="10" y2="0" />
          <line x1="-15" y1="30" x2="15" y2="0" />
          <line x1="-10" y1="30" x2="20" y2="0" />
          <line x1="-5" y1="30" x2="25" y2="0" />
          <line x1="0" y1="30" x2="30" y2="0" />
          <line x1="5" y1="30" x2="35" y2="0" />
          <line x1="10" y1="30" x2="40" y2="0" />
          <line x1="15" y1="30" x2="45" y2="0" />
          <line x1="20" y1="30" x2="50" y2="0" />
          <line x1="25" y1="30" x2="55" y2="0" />
          <line x1="30" y1="30" x2="60" y2="0" />
        </g>
      </symbol>
    ),
    f2: color => (
      <symbol key={'f2'} id={'f2'} viewBox="0 0 30 30">
        <g
          stroke="black"
          strokeWidth="0.9"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <line x1="-28" y1="30" x2="2" y2="0" />
          <line x1="-25" y1="30" x2="5" y2="0" />
          <line x1="-22" y1="30" x2="8" y2="0" />
          <line x1="-19" y1="30" x2="11" y2="0" />
          <line x1="-16" y1="30" x2="14" y2="0" />
          <line x1="-13" y1="30" x2="17" y2="0" />
          <line x1="-10" y1="30" x2="20" y2="0" />
          <line x1="-7" y1="30" x2="23" y2="0" />
          <line x1="-4" y1="30" x2="26" y2="0" />
          <line x1="-1" y1="30" x2="29" y2="0" />
          <line x1="2" y1="30" x2="32" y2="0" />
          <line x1="5" y1="30" x2="35" y2="0" />
          <line x1="8" y1="30" x2="38" y2="0" />
          <line x1="11" y1="30" x2="41" y2="0" />
          <line x1="14" y1="30" x2="44" y2="0" />
          <line x1="17" y1="30" x2="47" y2="0" />
          <line x1="20" y1="30" x2="50" y2="0" />
          <line x1="23" y1="30" x2="53" y2="0" />
          <line x1="26" y1="30" x2="56" y2="0" />
          <line x1="29" y1="30" x2="59" y2="0" />
        </g>
      </symbol>
    ),
    f3: color => (
      <g key="f3">
        <pattern
          id="checkerboard"
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
        >
          <path fill="white" d="m0,0h1v1H0" />
          <path fill="black" d="m0,0h1v2h1V1H0" fillOpacity="1" />
        </pattern>
        <symbol id="f3" viewBox="0 0 10 10">
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            style={{ fill: 'url(#checkerboard)' }}
          />
        </symbol>
      </g>
    ),
    f4: color => (
      <symbol key="f4" id="f4" viewBox="0 0 24 24">
        <rect
          fill="white"
          stroke="black"
          strokeWidth="0.5"
          x="11"
          y="0"
          width="2"
          height="20"
        />
        <g stroke="black" strokeWidth="1.5">
          <rect x="10" y="0" width="4" height="4" />
          <rect x="10" y="20" width="4" height="4" />
        </g>
      </symbol>
    ),
    f5: color => (
      <symbol key="f5" id="f5" viewBox="0 0 24 24">
        <rect
          fill="white"
          stroke="black"
          strokeWidth="0.5"
          x="0"
          y="11"
          width="20"
          height="2"
        />
        <g stroke="black" strokeWidth="1.5">
          <rect x="0" y="10" width="4" height="4" />
          <rect x="20" y="10" width="4" height="4" />
        </g>
      </symbol>
    ),
    f7: color => (
      <symbol key="f7" id="f7" viewBox="0 0 24 24">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
      </symbol>
    ),
    fm1: color => (
      <symbol key="fm1" id="fm1" viewBox="0 0 14 14">
        <g stroke="black" strokeWidth="0.5" strokeLinecap="square">
          <line x1="5" y1="5" x2="9" y2="9" />
          <line x1="9" y1="5" x2="5" y2="9" />
        </g>
      </symbol>
    ),
    fm2: color => (
      <symbol key="fm2" id="fm2" viewBox="0 0 14 14">
        <line
          x1="4"
          y1="7"
          x2="9"
          y2="7"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
        <polygon points="9,6 9,8 10,7" />
      </symbol>
    ),
    fm3: color => (
      <symbol key="fm3" id="fm3" viewBox="0 0 14 14">
        <line
          x1="4"
          y1="7"
          x2="9"
          y2="7"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
        <polygon points="4,6 4,8 3,7" />
      </symbol>
    ),
    fm4: color => (
      <symbol key="fm4" id="fm4" viewBox="0 0 14 14">
        <line
          x1="7"
          y1="4"
          x2="7"
          y2="9"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
        <polygon points="6,4 8,4 7,3" />
      </symbol>
    ),
    fm5: color => (
      <symbol key="fm5" id="fm5" viewBox="0 0 14 14">
        <line
          x1="7"
          y1="4"
          x2="7"
          y2="9"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
        <polygon points="6,9 8,9 7,10" />
      </symbol>
    ),
    fm6: color => (
      <symbol key="fm6" id="fm6" viewBox="0 0 128 128">
        <g fill="white" stroke="black" strokeWidth="3">
          <path d="m62.2 34.1c-11.6.7-17.7 7.3-18.2 19.2h11.7c.1-4.1 2.5-7.2 6.7-7.7 4.2-.4 8.2.6 9.4 3.4 1.3 3.1-1.6 6.7-3 8.2-2.6 2.8-6.8 4.9-9 7.9-2.1 3-2.5 6.9-2.7 11.7h10.3c.1-3.1.3-6 1.7-7.9 2.3-3.1 5.7-4.5 8.5-7 2.7-2.3 5.6-5.1 6-9.5 1.7-12.9-8.9-19.1-21.4-18.3" />
          <ellipse cx="62.5" cy="87.6" rx="6.5" ry="6.4" />
        </g>
      </symbol>
    ),
    fm7: color => (
      <symbol key="fm7" id="fm7" viewBox="0 0 128 128">
        <g fill="white" stroke="black" strokeWidth="1">
          <path d="m69 74.4h-10l-4-40.4h18z" />
          <ellipse cx="64" cy="86.4" rx="7.7" ry="7.6" />
        </g>
      </symbol>
    ),
    w1v: color => (
      <symbol key="w1v" id="w1v" viewBox="0 0 8 8">
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="8"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
      </symbol>
    ),
    w2v: color => (
      <symbol key="w2v" id="w2v" viewBox="0 0 24 24">
        <g stroke="black" strokeWidth="1.5" strokeLinecap="square">
          <rect
            x="11"
            y="4"
            width="2"
            height="16"
            fill="white"
            strokeWidth="0.5"
          />
          <line x1="12" y1="0" x2="12" y2="4" />
          <line x1="10" y1="4" x2="14" y2="4" />
          <line x1="10" y1="20" x2="14" y2="20" />
          <line x1="12" y1="20" x2="12" y2="24" />
        </g>
      </symbol>
    ),
    w3v: color => (
      <symbol key="w3v" id="w3v" viewBox="0 0 24 24">
        <g stroke="black" strokeWidth="1.5" strokeLinecap="square">
          <line x1="12" y1="0" x2="12" y2="24" />
          <line x1="10" y1="4" x2="14" y2="4" />
          <line x1="10" y1="20" x2="14" y2="20" />
        </g>
      </symbol>
    ),
    w4v: color => (
      <symbol key="w4v" id="w4v" viewBox="0 0 8 8">
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="8"
          strokeDasharray="1"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
      </symbol>
    ),
    w5v: color => (
      <symbol key="w5v" id="w5v" viewBox="0 0 24 24">
        <clipPath id="w5v-clip-path">
          <rect x="12" y="4" width="5" height="16" />
        </clipPath>
        <g stroke="black" strokeWidth="1.5" strokeLinecap="square">
          <rect
            x="12"
            y="4"
            width="3"
            height="16"
            fill="white"
            strokeWidth="0.5"
          />
          <line x1="12" y1="0" x2="12" y2="4" />
          <rect
            x="10"
            y="4"
            width="5"
            height="16"
            fill="none"
            rx="2"
            ry="2"
            clip-path="url(#w5v-clip-path)"
          />
          <line x1="12" y1="20" x2="12" y2="24" />
        </g>
      </symbol>
    ),
    w6v: color => (
      <symbol key="w6v" id="w6v" viewBox="0 0 24 24">
        <clipPath id="w6v-clip-path">
          <rect x="8" y="4" width="5" height="16" />
        </clipPath>
        <g stroke="black" strokeWidth="1.5" strokeLinecap="square">
          <rect
            x="10"
            y="4"
            width="3"
            height="16"
            fill="white"
            strokeWidth="0.5"
          />
          <line x1="12" y1="0" x2="12" y2="4" />
          <rect
            x="10"
            y="4"
            width="5"
            height="16"
            fill="none"
            rx="2"
            ry="2"
            clip-path="url(#w6v-clip-path)"
          />
          <line x1="12" y1="20" x2="12" y2="24" />
        </g>
      </symbol>
    ),
    w7v: color => (
      <symbol key="w7v" id="w7v" viewBox="0 0 24 24">
        <g stroke="black" strokeWidth="1.5" strokeLinecap="square">
          <line x1="12" y1="0" x2="12" y2="4" />
          <line x1="10" y1="4" x2="14" y2="4" />
          <line x1="10" y1="20" x2="14" y2="20" />
          <line x1="12" y1="20" x2="12" y2="24" />
        </g>
      </symbol>
    ),
    wm1v: color => (
      <symbol key="wm1v" id="wm1v" viewBox="0 0 14 14">
        <g stroke="black" strokeWidth="0.5" strokeLinecap="square">
          <line x1="5" y1="5" x2="9" y2="9" />
          <line x1="9" y1="5" x2="5" y2="9" />
        </g>
      </symbol>
    ),
    wm2v: color => (
      <symbol key="wm2v" id="wm2v" viewBox="0 0 14 14">
        <line
          x1="4"
          y1="7"
          x2="9"
          y2="7"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
        <polygon points="9,6 9,8 10,7" />
      </symbol>
    ),
    wm3v: color => (
      <symbol key="wm3v" id="wm3v" viewBox="0 0 14 14">
        <line
          x1="4"
          y1="7"
          x2="9"
          y2="7"
          stroke="black"
          strokeWidth="0.5"
          strokeLinecap="square"
        />
        <polygon points="4,6 4,8 3,7" />
      </symbol>
    ),
    wm4v: color => (
      <symbol key="wm4v" id="wm4v" viewBox="0 0 14 14">
        <g stroke="black" strokeWidth="0.5" strokeLinecap="square">
          <line x1="5" y1="6" x2="9" y2="2" />
          <line x1="5" y1="8" x2="9" y2="4" />
          <line x1="5" y1="10" x2="9" y2="6" />
        </g>
      </symbol>
    ),
    wm5v: color => (
      <symbol key="wm5v" id="wm5v" viewBox="0 0 14 14">
        <rect
          x="6"
          y="11"
          width="1"
          height="1"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      </symbol>
    ),
    wm6v: color => (
      <symbol key="wm6v" id="wm6v" viewBox="0 0 14 14">
        <rect
          x="7"
          y="11"
          width="1"
          height="1"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      </symbol>
    ),
    wm7v: color => (
      <symbol key="wm7v" id="wm7v" viewBox="0 0 96 96">
        <rect
          x="36"
          y="36"
          width="24"
          height="24"
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
          rx="4"
          ry="4"
        />
        <g stroke="black" strokeWidth="1.5" strokeLinecap="square">
          <line x1="39" y1="48" x2="45" y2="48" />
          <line x1="48" y1="39" x2="48" y2="45" />
          <line x1="57" y1="48" x2="51" y2="48" />
          <line x1="48" y1="57" x2="48" y2="51" />
        </g>
      </symbol>
    ),
  },
};
