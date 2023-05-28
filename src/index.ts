import { TaskService } from "./services/taskService";
import { PrefService } from "./services/prefService";
import { Task } from "./models/task";

// just type `nodemon` in project root to start it

/* on running for the first time you need to create a `data` folder in the `src` folder. 
So `src/data/tasksData.json`. Then create the tasksData.json and prefsData.json files in the data folder. 
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

const canSendUserReminder = (user: any): boolean => {
  // Get the current day and time
  let date = new Date();
  let day = date.getDay();
  let hour = date.getHours();

  // Get (and for now set) the user's prefered days and times
  let userPrefs = prefService.readPrefs().filter((p: any) => p.user === user)[0];
  console.log(user)
  console.log(prefService.readPrefs())
  if (!userPrefs) return false;
  if (!userPrefs.days.includes(day)) return false;
  if (!userPrefs.times.includes(hour)) return false;
  return true;
}

const sendReminder = (task: Task): void => {
  client.channels.cache.get(process.env.CHANNEL_ID).send("Test reminder please ignore");
}

const sendReminders = () => {
  const tasks = taskService.readTasks();
  tasks.forEach((task: Task) => {
    // for each task get the user and check if they can be reminded
    console.log("trying to send reminder")
    if (canSendUserReminder(`${task.assignedTo.username}#${task.assignedTo.discriminator}`)) {
      // send the reminder
      console.log("sending reminder")
      sendReminder(task);
    }
  });
}

client.on('ready', () => {
  console.log(`${client.user.tag} is onilne`);
  // send reminders every hour
  setInterval(sendReminders, 1000 /* * 60 * 60 */);
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  console.log(interaction.commandName);
  if (interaction.commandName === 'ping') {
    await interaction.reply('Cleanbot online');
  }
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'task') {
    const taskId = taskService.createTask(interaction.options.getString('content'), interaction.options.getUser('assigned'));
    await interaction.reply(`Task successfully created\n\nTask ID: ${taskId}\n${interaction.options.getString('content')}\nAssigned to: ${interaction.options.getUser('assigned')}`);
  }
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'done') {
    const taskId: number = interaction.options.getInteger('id');
    const status = taskService.removeTask(taskId);
    await interaction.reply(status ? `Task ${taskId} completed` : `Task ${taskId} not found. Either it never existed or has already been completed.`)
  }
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'prefs') {
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
  }
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