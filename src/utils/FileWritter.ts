import { App, Notice, Platform, normalizePath } from "obsidian";
import { path } from "./utils";


export class FileWritter {
    app: App;

    constructor(app: App) {
        this.app = app
    }

    async writeToFile(directoryPath: string, fileName: string, data: any) {
        const { vault } = this.app;
        const { adapter } = vault;

        let filePath = path.join(directoryPath, fileName)
        let content = this.parseDataToYaml(data)
        try {
            const fileExists = await adapter.exists(filePath);
            if (fileExists) {
                // If the file already exists, respond with error
                throw new Error(`${filePath} already exists`);
            }
            if (directoryPath !== '') {
                // If `input` includes a directory part, create it
                await this.createDirectory(directoryPath);
            }

            const File = await vault.create(filePath, content);
            // Create the file and open it in the active leaf
            let leaf = this.app.workspace.getLeaf(true);
            await leaf.openFile(File);

            console.log("create file " + filePath)
        } catch (error) {
            new Notice(error.toString());
        }
    }

    parseDataToYaml(data: any): string {
        let content = "---\n"
        content += this.generateYaml(data, "tags")
        content += this.generateYaml(data, "title")
        content += this.generateYaml(data, "image_url")
        content += this.generateYaml(data, "director")
        content += this.generateYaml(data, "author")
        content += this.generateYaml(data, "actors")
        content += this.generateYaml(data, "developer")
        content += this.generateYaml(data, "type")
        content += this.generateYaml(data, "platform")
        content += this.generateYaml(data, "country")
        content += this.generateYaml(data, "publish_date")
        content += this.generateYaml(data, "rating", "douban_rating")
        content += this.generateYaml(data, "detail_url", "douban_url")
        content += this.generateYaml(data, "desc")
        content += "---\n"

        return content
    }

    generateYaml(data: any, oldKey: string, newKey: string = ""): string {
        if (newKey.length == 0) {
          newKey = oldKey;
        }

        if (data[oldKey]) {
            return newKey + ": " + data[oldKey] + "\n"
        }

        return ""
    }

    /**
     * Creates a directory (recursive) if it does not already exist.
     * This is a helper function that includes a workaround for a bug in the
     * Obsidian mobile app.
     */
	  private async createDirectory(dir: string): Promise<void> {
      const { vault } = this.app;
      const { adapter } = vault;
      const root = vault.getRoot().path;
      const directoryPath = dir;
      const directoryExists = await adapter.exists(directoryPath);
      // ===============================================================
      // -> Desktop App
      // ===============================================================
      if (!Platform.isIosApp) {
        if (!directoryExists) {
          return adapter.mkdir(normalizePath(directoryPath));
        }
      }
      // ===============================================================
      // -> Mobile App (IOS)
      // ===============================================================
      // This is a workaround for a bug in the mobile app:
      // To get the file explorer view to update correctly, we have to create
      // each directory in the path one at time.
    
      // Split the path into an array of sub paths
      // Note: `normalizePath` converts path separators to '/' on all platforms
      // @example '/one/two/three/' ==> ['one', 'one/two', 'one/two/three']
      // @example 'one\two\three' ==> ['one', 'one/two', 'one/two/three']
      const subPaths: string[] = normalizePath(directoryPath)
        .split('/')
        .filter((part) => part.trim() !== '')
        .map((_, index, arr) => arr.slice(0, index + 1).join('/'));
    
      // Create each directory if it does not exist
      for (const subPath of subPaths) {
          const directoryExists = await adapter.exists(path.join(root, subPath));
          if (!directoryExists) {
            await adapter.mkdir(path.join(root, subPath));
          }
      }
	  }
}