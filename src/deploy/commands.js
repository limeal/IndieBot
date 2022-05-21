const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config()

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('calendar').setDescription('Redirect to calendar'),
    new SlashCommandBuilder().setName('cercle').setDescription('Replies with yellow circle!'),
    new SlashCommandBuilder().setName('pingoo')
        .setDescription('Pingoo a person')
        .addIntegerOption(option =>
            option
                .setName('ping_number')
                .setDescription('Number of time to ping by default 1')
                .setMinValue(1)
            )
        .addStringOption(option =>
            option
                .setName('people_id')
                .setDescription('Id of people to ping by default ethan')
            ),
    new SlashCommandBuilder().setName('deadline')
        .setDescription('Get deadline of projects')
        .addSubcommand(subcommand =>
            subcommand
                .setName('zappy')
                .setDescription('Get Zappy deadline')
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('indie')
                .setDescription('Get Indie deadline')
            ),
	new SlashCommandBuilder().setName('meeting')
        .setDescription('Meeting command management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new Meeting')
                .addStringOption(option =>
                    option
                        .setName('title')
                        .setDescription('Title of meeting')
                        .setRequired(true)
                    )
                .addStringOption(option =>
                        option
                            .setName('description')
                            .setDescription('Description of meeting')
                            .setRequired(true)
                    )
                .addStringOption(option =>
                    option
                        .setName('format')
                        .setDescription('Format: DD/MM hh:mm')
                        .setRequired(true)
                    )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a Meeting')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('Id of meeting to remove')
                        .setRequired(true)
                    )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('View list of next Meetings')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Pinged channel id')
                .addStringOption(option =>
                    option
                        .setName('channel_id')
                        .setDescription('Channel id of the channel to send announcement into')
                    )
        )
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.SECRET_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
