export class chromeStorage {
  public async setSecret(k: string, v: string) {
    return await chrome.storage.sync.set({ k: v });
  }

  public getSecret() {}
}
