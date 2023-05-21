/* 
run
node .\src\register-commands.js
from project root to register commands with the server
update server id in .env file
*/

require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Test bot connection'
    },
    {
        name: 'task',
        description: 'create a new task',
        options: [
            {
                name: 'content',
                description: 'describe the task',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'assigned',
                description: 'who is the task assigned to',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    {
        name: 'done',
        description: 'mark a task as done',
        options: [
            {
                name: 'id',
                description: 'the id of the task',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    }
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
        console.log("Successfully registered (/) commands.")
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