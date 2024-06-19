const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '이전곡',
    description:("재생된 마지막 곡으로 돌아가기"),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        if (!queue.history.previousTrack) return inter.editReply({ content: await Translate(`There was no music played before <${inter.member}>... try again ? <❌>`) });

        await queue.history.back();

        const backEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Playing the previous track <✅>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [backEmbed] });
    }
}