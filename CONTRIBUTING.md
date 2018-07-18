# Contributing

You have different ways to contribute to this project, see how to below.

## Submitting a bug

If you find a bug, you can open an issue (make sure there is not a similar issue already opened). Please be the more descriptive as possible:

- What is the bug
- What is the OS and web browser you encountered the bug with
- What is the exact scenario to reproduce the bug

## Adding a default grid

If you had created an interesting grid and you want to make it available as a default grid to everyone who uses GridBrush, follow these steps:

- Fork this repository
- Install GridBrush locally (see how to on [README](https://github.com/cravesoft/gridbrush/blob/master/README.md))
- Save your grid
- Decode the grid export string with this [site](https://www.base64decode.org/)
- Save the decoded object in a new key with the same name as your grid in the `public/gridsLibrary.json` file
- Commit your changes (without the built files)
- Submit a PR

## Adding a color theme

If you want to add a new color theme for GridBrush, follow these steps:

- Fork this repository
- Install GridBrush locally (see how to on [README](https://github.com/cravesoft/gridbrush/blob/master/README.md))
- Create a new color theme with a name in `src/config/colorThemes.js` (copy-paste an existing one and change the color values)
- Commit your changes (without the built files)
- Submit a PR

## Adding a new feature

If you want to add a new feature, create an issue with the 'enhancement' tag first.
