export interface Pref {
  user: string;
  schedule: {
    [key: number]: number[];
  }; // Object where keys are days (0-6) and values are arrays of hours (6-22)
}
