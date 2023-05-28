import { TaskService } from "./services/taskService";
import { PrefService } from "./services/prefService";
import { ChoreService } from "./services/choreService";
import { Task } from "./models/task";
import { Chore } from "./models/chore";

// just type `nodemon` in project root to start it

/* on running for the first time you need to create a `data` folder in the `src` folder. 
So `src/data/tasksData.json`. Then create the tasksData.json, prefsData.json and choresData.json files in the data folder. 
Each must have a [] in them to start with. */

require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

const taskService = new TaskService();
const prefService = new PrefService();
const choreService = new ChoreService();

const canSendUserReminder = (user: any): boolean => {

  const date = new Date();
  const day = date.getDay();
  const hour = date.getHours();

  console.log(`day: ${day}, hour: ${hour}`)

  const userPrefs = prefService.readPrefs().filter((p: any) => p.user === user)[0];

  for (let i = 0; i < userPrefs.days.length; i++) {
    if (userPrefs.days[i] === day && userPrefs.times[i] === hour) return true;
  }

  return false;
}

const sendReminder = (task: Task): void => {
  const message = `
  <@${task.assignedTo.id}> you have a task to do.
  Task ${task.id}: ${task.content}
  *Use the /done command with id ${task.id} to mark it as complete.*
  `
  client.channels.cache.get(process.env.CHANNEL_ID).send(message);
}

const sendReminders = (): void => {
  const tasks = taskService.readTasks();
  tasks.forEach((task: Task) => {
    if (canSendUserReminder(`${task.assignedTo.username}#${task.assignedTo.discriminator}`)) sendReminder(task);
  });
}

const createNewTasks = (): void => {
  const date = new Date();
  const chores = choreService.readChores();
  
  chores.forEach((chore: Chore) => {
    const nextDate = new Date(chore.lastAssigned);
    nextDate.setDate(nextDate.getDate() + chore.frequency);
    if (nextDate < date) {
      const taskId = taskService.createTask(`${chore.name}: ${chore.description}`, chore.defaultAssignedTo);
      chore.lastAssigned = date;
      choreService.updateChore(chore);
    }
  });
}

const runHourlyLoop = () => {
  sendReminders();
  createNewTasks();
}

client.on('ready', () => {
  console.log(`${client.user.tag} is onilne`);
  setInterval(runHourlyLoop, 1000 /* * 60 * 60 */); // send reminders every hour
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'ping') return;

  await interaction.reply('Cleanbot online');
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'task') return;

  const taskId = taskService.createTask(interaction.options.getString('content'), interaction.options.getUser('assigned'));
  await interaction.reply(`Task successfully created\n\nTask ID: ${taskId}\n${interaction.options.getString('content')}\nAssigned to: ${interaction.options.getUser('assigned')}`);
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'done') return;

  const taskId: number = interaction.options.getInteger('id');
  const status = taskService.removeTask(taskId);
  await interaction.reply(status ? `Task ${taskId} completed` : `Task ${taskId} not found. Either it never existed or has already been completed.`)
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'list-chores') return;

  await interaction.reply(choreService.listChores());
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'list-prefs') return;

  await interaction.reply(prefService.listPrefs());
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'list-tasks') return;

  await interaction.reply(taskService.listTasks());
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'prefs') return;

  const user = interaction.user.tag;

  const days: number [] = [];
  days.push(interaction.options.getInteger('day1'));
  days.push(interaction.options.getInteger('day2'));
  days.push(interaction.options.getInteger('day3'));

  const hours: number [] = [];
  hours.push(interaction.options.getInteger('timeday1'));
  hours.push(interaction.options.getInteger('timeday2'));
  hours.push(interaction.options.getInteger('timeday3'));

  prefService.upsertPref(user, days, hours);
  await interaction.reply(`Preferences for ${user} have been updated:\nDays: ${days}\nTimes: ${hours}`);
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'chore') return;

  const name = interaction.options.getString('name');
  const description = interaction.options.getString('description');
  const frequency = interaction.options.getInteger('frequency');
  const defaultAssignedTo = interaction.options.getUser('default-assigned');

  const choreId = choreService.createChore(name, description, frequency, defaultAssignedTo);
  await interaction.reply(`Chore successfully created\n\nChore ID: ${choreId}\nName: ${name}\nDescription: ${description}\nFrequency: ${frequency}\nDefault Assigned To: ${defaultAssignedTo}`);
});

client.login(process.env.CLIENT_TOKEN);









/*
Listening for messages and replying without slash commands

client.on('messageCreate', (message) => {
  if (message.content === 'ping') {
    message.reply('pong');
    console.log(message);
  }
});

*/
