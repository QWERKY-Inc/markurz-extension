# Getting Started

Default env file
```dotenv
REACT_APP_LOGIN_URL=http://localhost:3000
REACT_APP_COOKIE_DOMAIN=localhost
REACT_APP_COOKIE_NAME=next-auth.session-token
REACT_APP_BACKEND_URL=http://localhost:4000
# Should match the BE GQL_SCHEMA_TOKEN value
GQL_SCHEMA_TOKEN=mySecret
# Should match FE NEXTAUTH_SECRET secret value
REACT_APP_NEXTAUTH_SECRET=mySecret
```
## Running without building
It is possible to run the extension without having to build every time. To do so, add the env value
```dotenv
REACT_APP_SIMULATE_LOCALLY=1
```
Then, run the project with `yarn start`.
Once done, go to your `Application` tab of your browser and add a `token=<value>` inside the `Local Storage`. Once the 
page is reloaded with a valid token, you should appear logged in.

## Installation

### Chrome
- [chrome://extensions](chrome://extensions)
- Enable developer mode
- "Load unpacked"
- or drag & drop the `build` folder into the extensions

### Opera
- [opera://extensions](opera://extensions)
- Enable developer mode
- "Load unpacked"

### Firefox
- [about:addons](about:addons)
- Settings (cog button) install Add-on from file

### Safari
- Have a developer account
- [Convert an extension](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)
- Test inside Safari browser

## Available Scripts

In the project directory, you can run:

### `npm run build`

To build the project, this variable should be set in your environment.
```dotenv
INLINE_RUNTIME_CHUNK=false
```

Builds the app for production to the `build` folder, through `craco`.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

See the docs about [craco](https://github.com/dilanx/craco) for more information.

## Github Automation
- to run for [MacOS](https://docs.github.com/en/actions/deployment/deploying-xcode-applications/installing-an-apple-certificate-on-macos-runners-for-xcode-development#introduction)
- to deploy for [Chrome Extension Store](https://github.com/marketplace/actions/chrome-extension-upload-action)
- to deploy for [Edge](https://github.com/hocgin/action-edge-addone-upload), visit [Microsoft Partners](https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi) to get the credentials
