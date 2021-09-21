const vscode = require("vscode");

const decoration = {
  decorations: [],

  set(editor, line, commit) {
    const { enablePips } = vscode.workspace.getConfiguration("svn-gutter");
    const path =
      vscode.extensions.getExtension("beaugust.blamer-vs").extensionPath;
    let decoration;

    if (enablePips) {
      decoration = vscode.window.createTextEditorDecorationType({
        gutterIconPath: `${path}/img/${commit.image}`,
        gutterIconSize: "contain",
      });
    } else {
      decoration = vscode.window.createTextEditorDecorationType({
        after: {
          margin: "0 0 0 3em",
          textDecoration: "none",
        },
      });
    }

    this.decorations.push(decoration);
    editor.setDecorations(decoration, [
      {
        range: new vscode.Range(parseInt(line), 0, parseInt(line), 1000),
        hoverMessage: new vscode.MarkdownString(
          `${commit.revision}: ${commit.author}\n\n${commit.date}\n\n${commit.msg}`
        ),
      },
    ]);
  },

  destroy() {
    if (!this.decorations.length) return;
    this.decorations.forEach((decoration) => {
      decoration.dispose();
    });
  },
};

module.exports = decoration;
