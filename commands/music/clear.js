const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '지우기',
    description:('대기열에 있는 모든 음악을 지웁니다'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        if (!queue.tracks.toArray()[1]) return inter.editReply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... try again ? <❌>`) });

        queue.tracks.clear();

        const clearEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`The queue has just been cleared <🗑️>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [clearEmbed] });
    }
}