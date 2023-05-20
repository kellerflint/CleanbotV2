require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

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
  console.log(interaction.commandName);
  if (interaction.commandName === 'task') {
    await interaction.reply(`Task created: ${interaction.options.getString('content')}. Assigned to: ${interaction.options.getUser('assigned')}`);
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