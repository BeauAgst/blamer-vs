![GitHub package.json version](https://img.shields.io/github/package-json/v/BeauAgst/blamer-vs?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/BeauAgst/blamer-vs?style=for-the-badge)

![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/beaugust.blamer-vs?style=for-the-badge)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/beaugust.blamer-vs?style=for-the-badge)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/beaugust.blamer-vs?style=for-the-badge)

# SVN Gutter

This is the Visual Studio Code version of the [Blamer](https://github.com/BeauAgst/Blamer) plugin, built for Sublime Text. [Pull requests are always welcome!](https://github.com/BeauAgst/blamer-vs/issues/)

## Commands:

This extension contributes the following commands to the Command palette.

`SVN Gutter - Show Blame`: Adds icons to gutter with tooltips containing information from each revision

`SVN Gutter - Clear Blame`: Clears icons and tooltips

## Shortcuts:

Currently, only a single keyboard shortcut is available.

**SVN Gutter: Show Blame**
`CTRL + ALT + D` (Windows)
`CTRL + CMD + X` (Mac)

## Features

When run, this extension will place an icon next to each line of your file. Each differently-coloured icon means a different revision. Hovering a line will produce a tooltip, showing the committer, date, and message. For example, if you're working on a project and you want to see who modified a specific line:

https://github.com/BeauAgst/blamer-vs/assets/10343831/bcdcd279-06b9-42cf-a162-a8740d29c88d

## Requirements

This extension requires that you're either:

- On a Windows machine with Tortoise SVN installed, with command-line tools.
- A Unix machine.

## Extension Settings

**Enable Details** - By default, hovering over a line will display the log message for its revision. This can be turned off, which will significantly speed up the blame action.

**Enable Visual Indicator** - By default, the extension displays a coloured indicator next to each line number. This can be turned off, whilst still showing the blame log in the tooltip.

## Known Issues

- A little bit slow, because all unique logs have to be retrieved first. ([#3](/../../issues/3))
- Authentication errors [#5](/../../issues/5), [#9](/../../issues/9)

## TODO

- Per-file blame management. Currently only handles one file at a time. Look at storage solutions
- Configurable SVN path
- In-line blame messages, a-la git lens
- Add a blame "toggle" that goes between show/hide
- Add an optional sidebar button to toggle blame on active file
- Add an option to auto-blame on file open
  - svn info ${FILEPATH} to check if blame-able
- Automate release flow
  - Tests pass
  - https://github.com/marketplace/actions/gh-release
  - https://github.com/marketplace/actions/vsix-publisher

## Release Notes

## 0.5.2

- Fixed a bug where the commit author disappeared

## 0.5.1

- Handle cases where author metadata is missing [#53](/../../issues/53)
- Use spawn instead of exec [#53](/../../issues/53)
- Dependency updates

## 0.5.0

- Mac blame shortcut added
- Setting added to toggle visual indicator visibility [#10](/../../issues/10)
- Better error handling, blame indicator in workbench [#3](/../../issues/3)

## 0.4.0

- Revision number added to tooltips [#7](/../../issues/7)

## 0.3.2

- Fixed decoration issue causing characters to show incorrectly depending on the language [#6](/../../issues/6)

## 0.3.1

- Removed formatting error in decoration caused by conflict with `mailto:`
- Added icon to extension

## 0.3.0

- Linux support was added. [#2](/../../issues/2)

## 0.2.0

- Added keyboard shortcut
- Fixed readme typo

## 0.1.0

- Initial release
