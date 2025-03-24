export class Helper {

     static async DataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
          const res: Response = await fetch(dataUrl);
          const blob: Blob = await res.blob();
          return new File([blob], fileName, { type: 'image/png' });
     }

     static RandomNumber(min: number, max: number) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
     }

     static ConvertTimeZoneUTCToLocal = (dateToConvert: Date): string => {
          const date = new Date(dateToConvert);
          const options: Intl.DateTimeFormatOptions = {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric',
               hour: '2-digit',
               minute: '2-digit',
               second: '2-digit',
               hour12: false
          };
          return date.toLocaleString(undefined, options).replace(',', ' ');
     }
}