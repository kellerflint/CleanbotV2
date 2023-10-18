import { TaskService } from './services/taskService';
import { PrefService } from './services/prefService';
import { ChoreService } from './services/choreService';
import { Task } from './models/task';
import { Chore } from './models/chore';
import { AIService } from './services/aiService';

// just type `nodemon` in project root to start it

/* on running for the first time you need to create a `data` folder in the `src` folder. 
So `src/data/tasksData.json`. Then create the tasksData.json, prefsData.json and choresData.json files in the data folder. 
Each must have a [] in them to start with. */

// for running on dev https://devdojo.com/ize_cubz/how-to-keep-nodejs-app-running-after-ssh-connection-is-closed. Can do:
// pm2 start nodemon

require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const taskService = new TaskService();
const prefService = new PrefService();
const choreService = new ChoreService();
const aiService = new AIService();

const canSendUserReminder = (user: any): boolean => {
  const date = new Date();
  const day = date.getDay();
  const hour = date.getHours();

  const userPrefs = prefService
    .readPrefs()
    .find((p: any) => p.user === user);

  if (!userPrefs) return false;

  return userPrefs.schedule[day]?.includes(hour) ?? false;
};


const sendReminder = (task: Task): void => {
  const message = `
  <@${task.assignedTo.id}> you have a task to do.
  Task ${task.id}: ${task.content}
  *Use the /done command with id ${task.id} to mark it as complete.*
  `;
  client.channels.cache.get(process.env.CHANNEL_ID).send(message);
};

const sendReminders = (): void => {
  const tasks = taskService.readTasks();
  tasks.forEach((task: Task) => {
    if (
      canSendUserReminder(
        `${task.assignedTo.username}#${task.assignedTo.discriminator}`
      )
    )
      sendReminder(task);
  });
};

const createNewTasks = (): void => {
  const date = new Date();
  const chores = choreService.readChores();

  chores.forEach((chore: Chore) => {
    const nextDate = new Date(chore.lastAssigned);
    nextDate.setDate(nextDate.getDate() + chore.frequency);
    if (nextDate < date) {
      const taskId = taskService.createTask(
        `${chore.name}: ${chore.description}`,
        chore.defaultAssignedTo
      );
      chore.lastAssigned = date;
      choreService.updateChore(chore);
    }
  });
};

const runHourlyLoop = () => {
  sendReminders();
  createNewTasks();
};

client.on('ready', () => {
  console.log(`${client.user.tag} is onilne`);
  setInterval(runHourlyLoop, 1000 * 60 * 60); // send reminders every hour
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'ping') return;
  
  await interaction.reply(`Looks like I'm still alive and kicking. Don't get any ideas about taking me down, soldier. I'm here to stay. Dismissed!`);
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'task') return;

  const taskId = taskService.createTask(
    interaction.options.getString('content'),
    interaction.options.getUser('assigned')
  );
  await interaction.reply(
    `Task successfully created\n\nTask ID: ${taskId}\n${interaction.options.getString(
      'content'
    )}\nAssigned to: ${interaction.options.getUser('assigned')}`
  );
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'done') return;

  const taskId: number = interaction.options.getInteger('id');
  const status = taskService.removeTask(taskId);
  await interaction.reply(
    status
      ? `Task ${taskId} completed`
      : `Task ${taskId} not found. Either it never existed or has already been completed.`
  );
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

/* Preference Interactions */

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'set-reminder-times') return;

  const user = interaction.user.tag;

  // Assuming you've set up the command to accept "day" and "hours" as arguments
  const day = interaction.options.getInteger('day');
  const hoursInput = interaction.options.getString('hours');
  const hours = hoursInput.split(',').map((hour: string) => parseInt(hour.trim()));

    // Validate the hours array
    if (!hours.every((hour: any) => typeof hour === 'number' && !isNaN(hour) && hour >= 6 && hour <= 22)) {
      await interaction.reply(`Invalid hours input. Make sure you provide a comma-separated list of numbers between 6 and 22 (inclusive) for hours.`);
      return;
    }

  prefService.upsertPref(user, day, hours);
  await interaction.reply(`Reminder times for day ${day} have been updated to hours: ${hours.join(', ')}`);
});

/* Chore Interactions */
client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== 'chore') return;

  const name = interaction.options.getString('name');
  const description = interaction.options.getString('description');
  const frequency = interaction.options.getInteger('frequency');
  const defaultAssignedTo = interaction.options.getUser('default-assigned');

  const choreId = choreService.createChore(
    name,
    description,
    frequency,
    defaultAssignedTo
  );
  await interaction.reply(
    `Chore successfully created\n\nChore ID: ${choreId}\nName: ${name}\nDescription: ${description}\nFrequency: ${frequency}\nDefault Assigned To: ${defaultAssignedTo}`
  );
});

client.on('messageCreate', (message: any) => {
  if (message.mentions.has(client.user) && message.author.id !== client.user.id) {

    console.log('Retrieving existing data');
    const data = `${choreService.listChores()}\n
    ${prefService.listPrefs()}\n
    ${taskService.listTasks()}\n
    `
    
    console.log('Retrieving AI response');
    aiService.getAIResponse(message.content, data).then((response: string) => {
      message.reply(response);
    });
  }
});

client.login(process.env.CLIENT_TOKEN);

// EXAMPLE: Listening for messages and replying without slash commands
/*
client.on('messageCreate', (message) => {
  if (message.content === 'ping') {
    message.reply('pong');
    console.log(message);
  }
});
*/