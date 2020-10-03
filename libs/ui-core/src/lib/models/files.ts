export class FileInput {
  public fileNames: string;
  public lastModified: any;

  constructor(private _files: File[], private delimiter = ', ') {
    this.fileNames = this._files.map((f: File) => f.name).join(delimiter);
    this.lastModified = this._files.map((f: File) => f.lastModified);
  }

  get files() {
    return this._files || [];
  }

  /*get fileNames(): string {
    return this._fileNames;
  }*/
}
