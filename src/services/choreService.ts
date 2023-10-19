import { Chore } from '../models/chore';
const fs = require('fs');

export class ChoreService {
  choresDataPath = 'src/data/choresData.json';

  createChore(
    name: string,
    description: string,
    frequency: number,
    defaultAssignedTo: any
  ): number {
    const chore: Chore = {
      id: this.findNextId(),
      name: name,
      description: description,
      frequency: frequency,
      lastAssigned: new Date(),
      defaultAssignedTo: defaultAssignedTo,
    };

    this.saveChore(chore);

    return chore.id;
  }

  removeChore(id: number): boolean {
    const chores = this.readChores();

    const filteredChores = chores.filter((c: Chore) => c.id !== id);

    if (filteredChores.length === chores.length) return false;

    this.writeChores(filteredChores);

    return true;
  }

  saveChore(chore: Chore): void {
    let chores = this.readChores();

    chores.push(chore);

    this.writeChores(chores);
  }

  updateChore(chore: Chore): void {
    let chores = this.readChores();

    chores = chores.filter((c: Chore) => c.id !== chore.id);

    chores.push(chore);

    this.writeChores(chores);
  }

  writeChores(chores: Chore[]): void {
    fs.writeFile(this.choresDataPath, JSON.stringify(chores), (err: any) => {
      if (err) throw err;
      console.log('Done writing!');
    });
  }

  readChores(): Chore[] {
    let chores: Chore[] = [];

    try {
      const data = fs.readFileSync(this.choresDataPath, 'utf-8');
      chores = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }

    return chores;
  }

  listChores(): string {
    const chores = this.readChores();
    let message = 'All Chores:\n';
    chores.forEach((c: Chore) => {
      message += `${c.id}: ${c.name} - ${c.description} - Frequency: ${c.frequency} days - Last Assigned: ${c.lastAssigned} - Default Assigned To: ${c.defaultAssignedTo.username}\n`;
    });
    console.log(message)
    return message;
  }

  findNextId(): number {
    const chores = this.readChores();
    if (chores.length === 0) return 1;

    const idSet = new Set<number>(chores.map((c) => c.id));

    let i = 1;
    while (idSet.has(i)) {
      i++;
    }
    return i;
  }
}
