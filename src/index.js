const { Client, Intents } = require('discord.js');
const { meetingTask, listMeetings, channelId } = require('./tasks/meeting');
const moment = require('moment');
const calendarTask = require('./tasks/calendar');
const deadlineTask = require('./tasks/deadline');
const pingooTask = require('./tasks/pingoo');
require('dotenv').config();
require('moment-countdown');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let registered_pinged = []

let commands = [
    { name: 'ping', task: async (interaction) => { await interaction.reply(':yellow_circle:') }},
    { name: 'cercle', task: async (interaction) => { await interaction.reply('Pong!') }},
    { name: 'calendar', task: calendarTask },
    { name : 'meeting', task: meetingTask },
    { name: 'deadline', task: deadlineTask },
    { name: 'pingoo', task: pingooTask },
]

const checkMeeting = async (format) => {
    try {
        const result = await listMeetings(1, moment().add(1, format).toISOString());
        if (result.length === 0) return;
        if (registered_pinged.find(elem => (elem.format === format && elem.id === result[0].id)) !== undefined) return;
        const channel = await client.channels.fetch("907206905972265000");
        if (!channel) return;
        channel.send('@everyone Un meeting sur le sujet ' + result[0].summary + ' commencera d\'ici (' + moment(result[0].startDate).countdown().toString() + ')\n');
        registered_pinged.push({ format, id: result[0].id });
    } catch (e) {}
};

client.once('ready', () => {
    console.log('Server ready to listen');

    checkMeeting('hours');
    checkMeeting('days');
    setInterval(() => checkMeeting('hours'), 10 * 60 * 1000);
    setInterval(() => checkMeeting('days'), 10 * 60 * 1000);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	commands.find((elem) => elem.name === commandName).task(interaction, client);
});

client.login(process.env.SECRET_TOKEN);
