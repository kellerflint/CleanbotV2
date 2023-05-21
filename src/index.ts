import { TaskService } from "./services/taskService";

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

client.on('ready', () => {
  console.log(`${client.user.tag} is onilne`);
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