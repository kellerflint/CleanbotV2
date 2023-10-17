import { Pref } from '../models/prefs';
const fs = require('fs');

export class PrefService {
  prefsDataPath = 'src/data/prefsData.json';

  upsertPref(user: string, days: number[], times: number[]): void {
    const pref: Pref = {
      user: user,
      days: days,
      times: times,
    };

    this.savePref(pref);
  }

  savePref(pref: Pref): void {
    let prefs = this.readPrefs();

    if (prefs.length !== 0 && prefs.filter((p: Pref) => p.user === pref.user)) {
      prefs = prefs.filter((p: Pref) => p.user !== pref.user);
    }

    prefs.push(pref);

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
    const prefs = this.readPrefs();
    let message = 'All Prefs:\n';
    prefs.forEach((p: Pref) => {
      message += `${p.user} - ${p.days} - ${p.times}\n`;
    });
    return message;
  }
}
