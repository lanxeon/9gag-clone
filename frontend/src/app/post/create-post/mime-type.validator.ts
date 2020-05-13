import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        const arr4 = new Uint8Array(fileReader.result as ArrayBuffer).subarray(4, 8);
        let header = "";
        let offsetFourHeader = "";
        let isValid = false;
        // console.log(new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 8).toString());
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
          offsetFourHeader += arr4[i].toString(16);
        }
        console.log("Header is " + header);
        console.log("4 byte offset header is " + offsetFourHeader);
        
        switch (header) 
        {
          case "89504e47":   //PNGs
            isValid = true;
            break;
          case "ffd8ffe0"://JPG/JPEGs
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          case "47494638":   //GIFs 
            isValid = true;
            break;
          case "1a45dfa3":  //mkv
          case "4f676753":  //ogg
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if(offsetFourHeader === "66747970")
          isValid = true;

        console.log(isValid);
        if (isValid) 
          observer.next(null);
        else 
          observer.next({ invalidMimeType: true });
        
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    });
  return frObs;
};