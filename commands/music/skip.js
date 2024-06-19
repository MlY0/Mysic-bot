const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '스킵',
    description:('현재 재생중인 음악을 스킵합니다.'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const success = queue.node.skip();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: success ? await Translate(`Current music <${queue.currentTrack.title}> skipped <✅>`) : await Translate(`Something went wrong <${inter.member}>... try again ? <❌>`) });

        return inter.editReply({ embeds: [embed] });
    }
}