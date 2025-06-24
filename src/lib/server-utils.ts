import "server-only";

import * as fs from "fs";
import * as path from "path";

export function writeStringToFile(inputString: string, fileName: string) {
  const filePath = path.join(process.cwd(), "file-output", fileName);

  fs.writeFile(filePath, inputString, (error) => {
    if (error) {
      console.error("Error saving file:\n", error);
    } else {
      console.log("File saved to:", filePath);
    }
  });
}
