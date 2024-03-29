/* 
run
node src/register-commands.js
from project root to register commands with the server
update server id in .env file
*/

require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Test bot connection',
  },
  {
    name: 'task',
    description: 'create a new task',
    options: [
      {
        name: 'content',
        description: 'describe the task',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'assigned',
        description: 'who is the task assigned to',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  {
    name: 'done',
    description: 'mark a task as done',
    options: [
      {
        name: 'id',
        description: 'the id of the task',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  {
    name: 'list-chores',
    description: 'list all chores',
  },
  {
    name: 'list-tasks',
    description: 'list all tasks',
  },
  {
    name: 'list-reminder-times',
    description: 'list all reminder times',
  },
  {
    name: 'chore',
    description: 'create a new chore',
    options: [
      {
        name: 'name',
        description: 'name the chore',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'description',
        description: 'describe the chore',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'frequency',
        description: 'how often does the chore need to be done (in days)',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: 'default-assigned',
        description: 'who is the chore assigned to by default',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  {
    name: 'set-reminder-times',
    description: 'Set reminder times',
    options: [
      {
        name: 'day',
        description: 'Day to be reminded about tasks (0-6, 0 is Sunday)',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: 'hours',
        description: 'List of hours to be reminded on the selected day (e.g., "6,8,10" for 6:00 AM, 8:00 AM, and 10:00 AM)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
  try {
    console.log('Started registering application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('Successfully registered (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

/*

    {
        name: 'chore',
        description: 'Create a new chore',
        options: [
            {
                name: 'name',
                description: 'describe the chore',
                type: 3,
                required: true
            },
            {
                name: 'frequency',
                description: 'how many days before the chore is due again',
                type: 4,
                required: true
            }
        ]
    },

    */
