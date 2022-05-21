const moment = require('moment')
const { google } = require('googleapis');
const path = require('path')
const { private_key } = require('../../indiecalendar.json')
require('dotenv').config()

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let channelId = "977316209919946762"

const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    private_key,
    SCOPES
);
  
const calendar = google.calendar({
    version: 'v3',
    project: process.env.GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

const addMeetingTask = async (interaction) => {
    //let time = interaction.options.getString('format');
    let summary = interaction.options.getString('title');
    let desc = interaction.options.getString('description');
    let format = interaction.options.getString('format');

    const datas = format.split(' ')
    const final = '2022-' + datas[0] + 'T' + datas[1]  + ':00'
    var event = {
        'summary': summary,
        'location': 'Epitech',
        'description': desc,
        'start': {
          'dateTime': final,
          'timeZone': 'Europe/Paris',
        },
        'end': {
          'dateTime': moment(final).add(1, 'hours').toISOString(),
          'timeZone': 'Europe/Paris',
        }
    };

    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../indiecalendar.json'),
        scopes: 'https://www.googleapis.com/auth/calendar',
      });
      auth.getClient().then(a=>{
        calendar.events.insert({
          auth:a,
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          resource: event,
        }, async (err, event) => {
          if (err) {
            await interaction.reply('Error when adding meeting to list');
            return;
          }
          await interaction.reply('Successfuly added meeting to list: ' + event.data.id);
        });
      })
};

const deleteMeetingsTask = async (interaction) => {
    let eventId = interaction.options.getString('id');

    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../indiecalendar.json'),
        scopes: 'https://www.googleapis.com/auth/calendar',
      });
      auth.getClient().then(a=>{
        calendar.events.delete({
          auth:a,
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          eventId,
        }, async (err) => {
          if (err) {
            await interaction.reply('Error when adding removing a meeting from list');
            return;
          }
          await interaction.reply('Successfuly removed meeting to list');
        });
      })
};

const listMeetings = (maxResults = 10, timeMax = moment().add(7, 'days').toISOString()) => new Promise((resolve, reject) => {
    calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        timeMax,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      }, async (error, result) => {
        if (error) {
            console.log(error.message);
            reject('Erreur lors de la recuperation des meetings');
        } else {
            if (result.data.items.length > 0) {
                let final = [];
                result.data.items.forEach((item, index) => {
                    let startDate = new Date(Date.parse(item.start.dateTime));
                    let endDate = new Date(Date.parse(item.end.dateTime));

                    const formatDate = (date) => { return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()); }
                    final.push({index: index, start: formatDate(startDate), end: formatDate(endDate), summary: item.summary || "", startDate})
                })
                resolve(final);
          } else {
            reject('Pas de meetings plannifier.');
          }
        }
    })
})

const listMeetingsTask = async (interaction) => {
    try {
        const result = await listMeetings();
        let final = ""
        result.forEach(({ index, start, end, summary }) => {
            final += ('#' + index + 'Find Meeting (' + start + ' -> ' + end + '): ' + summary + '\n');
        })
        await interaction.reply(final);
    } catch (error) {
        await interaction.reply(error);
    }
}

const channelMeetingsTask = async (interaction, client) => {
    let channel_id = interaction.options.getString('channel_id');

    if (!client.channels.cache.get(channel_id))
        return await interaction.reply("Cannot set announcement to invalid channel")
    channelId = channel_id;
    await interaction.reply("Successfuly setup !")
};

let commands = [
    {name: 'add', task: addMeetingTask},
    {name: 'list', task: listMeetingsTask},
    {name: 'channel', task: channelMeetingsTask},
    {name: 'remove', task: deleteMeetingsTask}
]

const meetingTask = async (interaction, client) => {

    let execute = commands.find((element) => element.name === interaction.options.getSubcommand());
    if (!execute)
        await interaction.reply('Meeting Help Section!')
    else
        execute.task(interaction, client)
};

module.exports = { meetingTask, listMeetings, channelId };