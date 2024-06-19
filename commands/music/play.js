const { QueryType, useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '재생',
    description:("음악을 재생합니다"),
    voiceChannel: true,
    options: [
        {
            name: '음악',
            description:('재생하고 싶은 음악을 검색합니다'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter, client }) {
        const player = useMainPlayer();

        const song = inter.options.getString('음악');
        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.YOUTUBE_SEARCH
        });

        let defaultEmbed = new EmbedBuilder().setColor('#2f3136');

        if (!res?.tracks.length) {
            defaultEmbed.setAuthor({ name: await Translate(`No results found... try again ? <❌>`) });
            return inter.editReply({ embeds: [defaultEmbed] });
        }

        try {
            const { track } = await player.play(inter.member.voice.channel, res.tracks[0], {
                nodeOptions: {
                    metadata: {
                        channel: inter.channel
                    },
                    volume: client.config.opt.volume,
                    leaveOnEmpty: client.config.opt.leaveOnEmpty,
                    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                    leaveOnEnd: client.config.opt.leaveOnEnd,
                    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
                }
            });

            defaultEmbed.setAuthor({ name: await Translate(`Loading <${track.title}> to the queue... <✅>`) });
            await inter.editReply({ embeds: [defaultEmbed] });
        } catch (error) {
            console.log(`Play error: ${error}`);
            defaultEmbed.setAuthor({ name: await Translate(`I can't join the voice channel... try again ? <❌>`) });
            return inter.editReply({ embeds: [defaultEmbed] });
        }
    }
}
