const pingooTask = async (interaction, client) => {
    let times = interaction.options.getInteger('ping_number');

    await interaction.reply({
        content: `You sucessfuly order a pingoo`,
        ephemeral: true
    });
    for (let i = 0; i < times; i++)
        interaction.channel.send('<@265868986858602496>').then(msg => msg.delete({timeout:"10"}))
};

module.exports = pingooTask;