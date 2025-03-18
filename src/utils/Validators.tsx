export class Validators {
     // email
     static get email() {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
     }
}

export const groupBy = (input: any[], key: string) => {
     return input.reduce((acc, currentValue) => {
          let groupKey = currentValue[key];
          if (!acc[groupKey]) {
               acc[groupKey] = [];
          }
          acc[groupKey].push(currentValue);
          return acc;
     }, {});
};