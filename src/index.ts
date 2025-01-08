import { watch, statSync, readdirSync } from "node:fs";
import type { FSWatcher } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { LiveDirectoryOptions, LiveFileOptions } from "@/types";

export class LiveFile {
  constructor(opts: LiveFileOptions) {
    const stats = statSync(opts.path);

    if (!stats.isFile()) {
      throw new Error(`LiveFile: file ${opts.path} not exists.`);
    }

    this.filePath = opts.path;
    this.extension = path.extname(opts.path);
    this.demanded = !opts.onDemand;

    if (!opts.onDemand) {
      this._body = this.bodyPromise();
    }

    if (opts.watch) {
      this.watcher = watch(opts.path, { encoding: "buffer" }, () => {
        if (this.demanded) {
          this._body = this.bodyPromise();
        }
      });
    }
  }

  readonly extension: string;
  private readonly filePath: string;
  private demanded: boolean;
  private _body: Promise<Buffer> | undefined;
  private readonly watcher: FSWatcher | undefined;

  private async bodyPromise(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      readFile(this.filePath)
        .then((data) => {
          resolve(data);
        })
        .catch((err: unknown) => {
          reject(err as Error);
        });
    });
  }

  dispose(): void {
    this.watcher?.close();
  }

  get size(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.body
        .then((data) => {
          resolve(data.length);
        }).catch((e: unknown) => {
          reject(e as Error);
        });
    });
  }

  get body(): Promise<Buffer> {
    if (this._body === undefined) {
      this._body = this.bodyPromise();
      this.demanded = true;
    }

    return this._body;
  }
}

export class LiveDirectory {
  constructor(opts: LiveDirectoryOptions) {
    opts.dir = path.normalize(opts.dir);

    function searchFile(inDir: string, outFiles: Record<string, LiveFile | undefined>): void {
      const files = readdirSync(inDir);

      for (const file of files) {
        const filePath = path.join(inDir, file);

        const fileStat = statSync(filePath);

        if (fileStat.isDirectory()) {
          searchFile(filePath, outFiles);
        } else {
          if (opts.maxCount !== undefined && opts.maxCount === Object.keys(outFiles).length) {
            return;
          }

          if (opts.maxLength !== undefined && opts.maxLength < fileStat.size) {
            continue;
          }

          outFiles[filePath.replace(opts.dir, "").replaceAll("\\", "/")] = new LiveFile({
            path: filePath,
            watch: opts.watch ?? true,
            onDemand: opts.onDemand ?? true
          });
        }
      }
    }

    searchFile(opts.dir, this.files);
  }

  readonly files: Record<string, LiveFile> = {};

  dispose(): void {
    for (const [key, file] of Object.entries(this.files)) {
      file.dispose();
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.files[key];
    }
  }

  disposeFile(key: string): void {
    if (Object.hasOwn(this.files, key)) {
      this.files[key].dispose();
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.files[key];
    }
  }

  getFile(filePath: string): LiveFile | undefined {
    return this.files[filePath];
  }
}
