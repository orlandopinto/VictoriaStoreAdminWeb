export class Helpers {

     static async DataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
          const res: Response = await fetch(dataUrl);
          const blob: Blob = await res.blob();
          return new File([blob], fileName, { type: 'image/png' });
     }

     static RandomNumber(min: number, max: number) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
     }
}