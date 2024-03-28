# Change Log

All notable changes to the "blamer-vs" extension will be documented in this file.

## 0.6.0

-   Major refactor & update of the codebase
-   Introduces auto-blame - blame files as you open them
-   Adds configuration option to disable fetching logs. Blame will still work as usual
-   Fixes bug where revision is not set, blamer would fail
-   Adds a toggle command - toggle between showing and clearing blame
-   Appends blame to the line when clicked, a-la gitlens

## 0.5.2

-   Fixed a bug where the commit author disappeared

## 0.5.1

-   Handle cases where author metadata is missing
-   Use spawn instead of exec
-   Dependency updates

## 0.5.0

-   Mac blame shortcut added
-   Setting added to toggle visual indicators
-   Better error handling, blame indicator in workbench

## 0.4.0

-   Revision number added to tooltips

## 0.3.2

-   Fixed decoration issue causing characters to show incorrectly depending on the language

## 0.3.1

-   Removed formatting error in decoration caused by conflict with `mailto:`

## 0.3.0

-   Linux support was added.

## 0.2.0

-   Added keyboard shortcut
-   Fixed readme typo

## 0.1.0

-   Initial release
