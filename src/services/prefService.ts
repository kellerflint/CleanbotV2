import { Pref } from '../models/prefs';
const fs = require('fs');

export class PrefService {
  prefsDataPath = 'src/data/prefsData.json';

  upsertPref(user: string, day: number, hours: number[]): void {
    let prefs = this.readPrefs();
    const existingPref = prefs.find(p => p.user === user);

    if (existingPref) {
      existingPref.schedule[day] = hours;
    } else {
      const newPref: Pref = {
        user: user,
        schedule: {}
      };
      newPref.schedule[day] = hours;
      prefs.push(newPref);
    }

    this.writePrefs(prefs);
  }

  writePrefs(prefs: Pref[]): void {
    fs.writeFile(this.prefsDataPath, JSON.stringify(prefs), (err: any) => {
      if (err) throw err;
      console.log('Done writing!');
    });
  }

  readPrefs(): Pref[] {
    let prefs: Pref[] = [];

    try {
      const data = fs.readFileSync(this.prefsDataPath, 'utf-8');
      prefs = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }

    return prefs;
  }

  listPrefs(): string {
    const daysMap: Record<string, string> = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday'
    };

    const prefs = this.readPrefs();
    let message = 'All Prefs:\n';
    prefs.forEach((p: Pref) => {
      const schedule = Object.entries(p.schedule)
        .map(([day, hours]) => `${daysMap[day]}: ${hours.join(', ')}`)
        .join('\n');
      message += `${p.user}:\n${schedule}\n\n`;
    });
    return message;
}

}
