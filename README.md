<div align="center">

# <img align="top" src="assets/icon.png" alt="tailname icon" width="40" /> tailname

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/) 
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![License](https://img.shields.io/github/license/SapphoSys/tailname?labelColor=black&color=#3f5db3)](https://github.com/SapphoSys/tailname/blob/master/LICENSE)

A browser extension that finds custom tailnet name offers for your Tailscale account using keywords.

<div style="display: flex; justify-content: center; gap: 1em;">
  <img src=".github/assets/1_home.png" alt="Home page" width="200" />
  <img src=".github/assets/2_words.png" alt="Words screen" width="200" />
  <img src=".github/assets/3_offers.png" alt="Offers screen" width="200" />
</div>
</div>

## Update
1. If you're encountering an "unknown eligibility" error, please download the [new release here!](https://github.com/SapphoSys/tailname/releases/tag/v1.0.2)
2. If you're encountering the "This add-on could not be installed because it has not been verified" error on Firefox, I've updated the Firefox guide below.

## How to install
### Chromium-based browsers (Google Chrome, Microsoft Edge, etc)
*We plan on submitting this extension to the Chrome Web Store soon.*

In the meantime, use the following instructions to sideload the extension:

0. Get the [latest release for Chromium](https://github.com/SapphoSys/tailname/releases/latest/download/tailname-chrome.zip).
1. Extract the ZIP archive using an archival program of your choice.
2. Navigate to the Extensions page using `chrome://extensions`.
3. Click the "Load unpacked" button.
4. Select the extracted folder of the extension.
5. Done!

### Gecko-based browsers (Firefox, Zen Browser, etc)
*The extension submission is currently awaiting a review on the Mozilla Add-on Developer Hub.*

In the meantime, use the following instructions to temporarily sideload the extension:

0. Get the [latest release for Firefox](https://github.com/SapphoSys/tailname/releases/latest/download/tailname-firefox.zip).
1. Navigate to the Debugging page using `about:debugging#/runtime/this-firefox`.
2. Click on "Load Temporary Add-on..."
3. Select the ZIP archive of the extension.
4. Done!
Unfortunately, this means you'll have to do steps 1-3 everytime you restart the browser.

## License

This repository is licensed under the [zlib](LICENSE) license.

This extension is not affiliated with Tailscale, Inc.

© 2025 Sapphic Angels.
