const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { AudioFilters, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '필터',
    description:('트랙에 필터 추가'),
    voiceChannel: true,
    options: [
        {
            name: '필터',
            description:('추가할 필터'),
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [...Object.keys(AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25)],
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0];
        const selectedFilter = inter.options.getString('필터');

        const filters = [];
        queue.filters.ffmpeg.getFiltersDisabled().forEach(f => filters.push(f));
        queue.filters.ffmpeg.getFiltersEnabled().forEach(f => filters.push(f));

        const filter = filters.find((x) => x.toLowerCase() === selectedFilter.toLowerCase().toString());

        let msg = await Translate (`This filter doesn't exist <${inter.member}>... try again ? <❌ \n>`) +
            (actualFilter ? await Translate(`Filter currently active: <**${actualFilter}**. \n>`) : "") +
            await Translate(`List of available filters:`);
        filters.forEach(f => msg += `- **${f}**`);

        if (!filter) return inter.editReply({ content: msg });

        await queue.filters.ffmpeg.toggle(filter);

        const filterEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`The filter <${filter}> is now <${queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : '비활성화'}> <✅\n> *Reminder: the longer the music is, the longer this will take.*`) })
            .setColor('#2f3136');

        return inter.editReply({ embeds: [filterEmbed] });
    }
}