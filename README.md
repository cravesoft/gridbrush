# GridBrush

GridBrush is an app to create scalable vector grids.
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

**See the [app site](http://cravesoft.github.io/gridbrush)**.

## Install GridBrush locally

- Clone this repo
- In the folder you cloned the repo run `npm install`
- Launch the local server (with hot js/css reloading) with `npm start` (note that it will be less efficient than the built version, see how to use the built version below)

## Build GridBrush and use it locally

- Install GridBrush locally (see above)
- Run `npm run build`
- You will have to use a local web server and set `build/` as your root folder to run GridBrush if you want to use the default grids
- To do that you can use [http-server](https://github.com/indexzero/http-server). install it globally (`npm install http-server -g`) then set `build/` as your current working directory (`cd build`) then run `http-server`. The URL where you can access GridBrush should be written in your terminal

## Dependencies

- [react-modal](https://github.com/reactjs/react-modal)
- [react-notification-system](https://github.com/igorprado/react-notification-system)
- [react-svg-loader](https://github.com/boopathi/react-svg-loader/tree/master/packages/react-svg-loader)
