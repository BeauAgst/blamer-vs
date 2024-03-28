import * as assert from "assert";
import * as vscode from "vscode";
import { EXTENSION_ID } from "../const/extension";

// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("should be present", () => {
    assert.ok(vscode.extensions.getExtension(EXTENSION_ID));
  });

  test("should be able to activate the extension", function (done) {
    this.timeout(60 * 1000);
    const extension = vscode.extensions.getExtension(
      EXTENSION_ID
    ) as vscode.Extension<any>;

    if (!extension) {
      assert.fail("Extension not found");
    }

    if (!extension.isActive) {
      extension.activate().then(
        (_api) => {
          done();
        },
        () => {
          assert.fail("Failed to activate extension");
        }
      );
    } else {
      done();
    }
  });
});
