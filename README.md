<div  id="flickrawr-logo"  align="center">

<br />

<img  src="./public/logo.png"  alt="flickrawr logo"  width="200"/>

<h1>flickrawr!</h1>

<h3>rawrrrr! for images</h3>

</div>

<div align="center">

**Lightweight photo gallery using the Flickr Search API, to showcase a full React stack using React hooks, AWS, gitlab CI, material UI and suitCSS.**

</div>

## Table of Contents

- [Try it out](#try)
- [Download/Install](#download-install)
- [Pipeline](#pipeline)
- [AWS](#aws)
- [Frontend Develoipment](#frontend)
- [Add Features](#app-features)

## <a id="try"></a>Try it out

flickrawr is currently deployed at (https://flickrawr.typescript.studio).

<a id="download-install"></a>Download/Install

## <a id="pipeline"></a>Pipeline

This app is currently automatically deployed to S3 using gitlabs pipeline, view the pipeline at (https://gitlab.com/LucasLee/flickrawr/pipelines).

## <a id="aws"></a>AWS

- This app is deployed using a cloudformation templates that creates a S3 bucket and a cloudfront instance.

- The .gitlab-ci.yml file deploys to S3 when code is push to the master branch.

- Cloudfront act as a reverse proxy to serve the api endpoints from flickr origin to /api.

- S3 serves the static React app.

## <a id="frontend"></a>Frontend Development

- This app is written purely on React hooks api for managing state.

- This app does not use any other external component libaries besides material-ui.

- This app was written to be responsive on mobile device.

- All React files are written in typescript.

- tslink and stylelint are setup to ensure code qualuty. 

## <a id="app-features"></a>App Features

- Search bar has a auto interval that gets triggered when the user start typing, gets refresh when the user types, and will submit the search if the user stop typing.

- The search bar in the main content will automatically be moved to the toolbar when it becomes out of view and will remain visible there.

- Search history is kept and you can reuse those search terms simply clicking on them, the history is kept in local storage for persistent.

- Clicking on the menu button will open search preference for configuring the API call, the settings here will persist using local storage.

- Reaching the bottom of a page will, automatically trigger to lazy more items. 


