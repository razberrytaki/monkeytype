/**
 * @deprecated IndexedDB removed in privacy fork
 * This file is a stub to prevent build errors.
 * Files are now stored using localStorage.
 */

class FileStorage {
  private data: Record<string, string> = {};

  constructor(_dbName = "file-storage-db") {
    // Load from localStorage
    const stored = localStorage.getItem("file-storage-db");
    /* oxlint-disable-next-line strict-boolean-expressions */
    if (stored) {
      try {
        this.data = JSON.parse(stored) as Record<string, string>;
      } catch {
        this.data = {};
      }
    }
  }

  async put(key: string, value: string): Promise<void> {
    this.data[key] = value;
    localStorage.setItem("file-storage-db", JSON.stringify(this.data));
  }

  async get(key: string): Promise<string | undefined> {
    return this.data[key];
  }

  async delete(key: string): Promise<void> {
    const newData: Record<string, string> = {};
    Object.entries(this.data).forEach(([k, v]) => {
      if (k !== key) {
        newData[k] = v;
      }
    });
    this.data = newData;
    localStorage.setItem("file-storage-db", JSON.stringify(this.data));
  }

  async clear(): Promise<void> {
    this.data = {};
    localStorage.setItem("file-storage-db", JSON.stringify(this.data));
  }

  async hasFile(key: string): Promise<boolean> {
    return key in this.data;
  }

  async storeFile(key: string, value: string): Promise<void> {
    return this.put(key, value);
  }

  async deleteFile(key: string): Promise<void> {
    return this.delete(key);
  }

  async getFile(key: string): Promise<string | undefined> {
    return this.get(key);
  }
}

/* oxlint-disable-next-line no-deprecated */
const fileStorage = new FileStorage();
export default fileStorage;
