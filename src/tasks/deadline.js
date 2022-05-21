const moment = require('moment');
require('dotenv').config()
require('moment-countdown');

const zappyDeadTask = async (interaction) => {
    await interaction.reply('Zappy END -> ' + moment(process.env.ZAPPY_DEADLINE).countdown().toString())
};

const indieDeadTask = async (interaction) => {
    await interaction.reply('INDIE END -> ' + moment(process.env.INDIE_DEADLINE).countdown().toString())
};

let commands = [
    {name: 'zappy', task: zappyDeadTask},
    {name: 'indie', task: indieDeadTask},
]

const deadlineTask = async (interaction) => {
    let execute = commands.find((element) => element.name === interaction.options.getSubcommand());
    if (!execute)
        await interaction.reply('Deadline Help Section!')
    else
        execute.task(interaction)
};

module.exports = deadlineTask;