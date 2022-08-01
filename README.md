# EVS-SIP

## 1 - Introduction

This repository contains both the frontend and the backend for EVS-SIP.

## 2 - How to set up in a local development environment

### 2.1 - Environment variables

Modify `.env` to specify the following variables:

- `NODE_ENV` The type of environment. Set this to `dev`.
- `PORT` The port on which the frontend is run. Ensure that this is different from the port used by the backend.
- `LOGDIR` The path in which log files will be stored.
- `EVSSIP_SERV_API_URL` The URL for the search API. Something like `http://localhost:3000/service/search`.
- `REACT_APP_DEV_API_URL` I don't know what this is. Something like `http://localhost:3000/api/search`.

### 2.2 - Elasticsearch index

Build an Elasticsearch index by performing the following:

1. Confirm that an ES service is available by running

    ```bash
    curl -X GET http://localhost:9200
    ```

2. Delete the current index by running

    ```bash
    curl -X DELETE http://localhost:9200/_all
    ```

3. Build a new index by running

    ```bash
    curl http://localhost:3000/service/search/buildIndex
    ```

    You may need to uncomment the route.

### 2.3 - Run Elasticsearch

If Elasticsearch is not already running, execute the command

```bash
elasticsearch
```

Elasticsearch should default to running on port `9200`.

### 2.4 - Run the backend

Execute the command

```bash
node app.js
```

### 2.5 - Run the frontend

Execute the command

```bash
npm run frontend
```

## 3 - Project structure

stub

## Default React README below

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
