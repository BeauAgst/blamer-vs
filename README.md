![GitHub package.json version](https://img.shields.io/github/package-json/v/BeauAgst/blamer-vs?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/BeauAgst/blamer-vs?style=for-the-badge)

![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/beaugust.blamer-vs?style=for-the-badge)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/beaugust.blamer-vs?style=for-the-badge)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/beaugust.blamer-vs?style=for-the-badge)

# SVN Gutter

A Visual Studio Code extension to SVN blame files.
When run, this extension will place an icon next to each line of your file. Each differently-coloured icon means a different revision. Hovering a line will display a tooltip, showing the committer, date, and message. Blame data will also display inline.

https://github.com/BeauAgst/blamer-vs/assets/10343831/bcdcd279-06b9-42cf-a162-a8740d29c88d

## Requirements

**Note**: This extension leverages your machine's SVN installation, so you need to install [SVN](https://subversion.apache.org/) first.

### Windows users

If you use TortoiseSVN, make sure the option Command Line Tools is checked during installation, and C:\Program Files\TortoiseSVN\bin is available in PATH.

## Commands

This extension contributes the following commands to the Command palette.

| Command                       | Description                                                            | Shortcut                                               |
| ----------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| **SVN Gutter - Show blame**   | Blames file, and retrieves log data (if setting is enabled)            | `CTRL + ALT + D` (Windows) <br/>`CTRL + CMD + X` (Mac) |
| **SVN Gutter - Clear blame**  | Clears the applied blame for the active file                           |                                                        |
| **SVN Gutter - Toggle blame** | Will toggle between fetching blame data and clearing visual indicators | `CTRL + ALT + E` (Windows) <br/>`CTRL + CMD + Y` (Mac) |

## Configuration

| Setting                      | Description                                                                                | Default value |
| ---------------------------- | ------------------------------------------------------------------------------------------ | ------------- |
| **Auto Blame**               | Automatically blames files as you open them.                                               | `true`        |
| **Enable Details**           | Enables popup revision log data. Disabling this setting will significantly speed up blame. | `false`       |
| **Enable Visual Indicators** | Toggle visual indicators that sit to the left of the line number.                          | `true`        |

## Known Issues

- Causes slowdown when the "**Enable Details**" setting is enabled because all unique logs have to be retrieved first. ([#3](/../../issues/3))
- Authentication errors [#5](/../../issues/5), [#9](/../../issues/9)

## Feedback & Contributing

Please report any bugs, suggestions or documentation requests via [issues](/../../issues)
Feel free to submit [pull requests](/../../pulls)

## TODO

- In-line blame messages, a-la git lens
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
