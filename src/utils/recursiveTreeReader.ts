import * as fs from 'fs';
import * as path from 'path';

interface RecursiveTreeReaderOptions {
  basePath?: string;
}

const recursiveTreeReader = (
  folderPath: string,
  options?: RecursiveTreeReaderOptions
) => {
  return new Promise<Array<string>>(async (resolve, reject) => {
    const absoluteFolderPath: string = path.resolve(folderPath);
    let files: Array<string> = [];
    const pathArray: Array<string> = [];

    options = options ?? {};
    if (!options.basePath) options.basePath = absoluteFolderPath;
    else options.basePath = path.resolve(options.basePath);

    try {
      files = fs.readdirSync(absoluteFolderPath);
    } catch (error) {
      reject(error);
    }

    for (let file of files) {
      let fileStat: fs.Stats | null = null;
      const filePath: string = path.join(absoluteFolderPath, file);

      try {
        fileStat = fs.statSync(filePath);
      } catch (error) {
        reject(error);
      }

      if (fileStat?.isDirectory()) {
        const recursivePath: Array<string> = (await recursiveTreeReader(
          filePath,
          { basePath: options?.basePath }
        )) as Array<string>;
        pathArray.push(...recursivePath);
      } else if (fileStat?.isFile() && file.endsWith('.ts')) {
        pathArray.push(path.relative(options.basePath, filePath));
      }
    }

    resolve(pathArray);
  });
};

export default recursiveTreeReader;
