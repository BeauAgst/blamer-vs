import { ExtensionContext } from "vscode";

export class Storage {
  constructor(private context: ExtensionContext) {}

  async get<T>(key: string) {
    return this.context.workspaceState.get<T>(key);
  }

  async getKeys() {
    return await this.context.workspaceState.keys();
  }

  async set<T>(key: string, value: T) {
    return this.context.workspaceState.update(key, value);
  }

  async delete(key: string) {
    return this.context.workspaceState.update(key, undefined);
  }

  async clear() {
    const keys = await this.getKeys();
    return Promise.all(
      keys.map((key) => this.context.workspaceState.update(key, undefined))
    );
  }
}
