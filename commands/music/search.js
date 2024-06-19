const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '검색',
    description: '음악을 검색합니다',
    voiceChannel: true,
    options: [
        {
            name: '음악',
            description:('음악을 검색합니다'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        const player = useMainPlayer();
        const song = inter.options.getString('음악');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.YOUTUBE_SEARCH
        });

        if (!res?.tracks.length) return inter.editReply({ content: await Translate(`No results found <${inter.member}>... try again ? <❌>`) });

        const queue = player.nodes.create(inter.guild, {
            metadata: {
             channel: inter.channel
                    },
            spotifyBridge: client.config.opt.spotifyBridge,
            volume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEmpty: client.config.opt.leaveOnEmpty
        });
        const maxTracks = res.tracks.slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Results for <${song}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`<${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n> Select choice between <**1**> and <**${maxTracks.length}**> or <**cancel** ⬇️>`))
            .setTimestamp()
            .setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })

        inter.editReply({ embeds: [embed] });

        const collector = inter.channel.createMessageCollector({
            time: 15000,
            max: 1,
            errors: ['시간'],
            filter: m => m.author.id === inter.member.id
        });

        collector.on('collect', async (query) => {
            collector.stop();
            if (query.content.toLowerCase() === 'cancel') {
                return inter.followUp({ content: await Translate(`Search cancelled <✅>`), ephemeral: true });
            }

            const value = parseInt(query);
            if (!value || value <= 0 || value > maxTracks.length) {
                return inter.followUp({ content: await Translate(`Invalid response, try a value between <**1**> and <**${maxTracks.length}**> or <**cancel**>... try again ? <❌>`), ephemeral: true });
            }

            try {
                if (!queue.connection) await queue.connect(inter.member.voice.channel);
            } catch {
                await player.deleteQueue(inter.guildId);
                return inter.followUp({ content: await Translate(`I can't join the voice channel <${inter.member}>... try again ? <❌>`), ephemeral: true });
            }

            await inter.followUp({content: await Translate(`Loading your search... <🎧>`), ephemeral: true });

            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.isPlaying()) await queue.node.play();
        });

        collector.on('end', async (msg, reason) => {
            if (reason === '시간') return inter.followUp({ content: await Translate(`Search timed out <${inter.member}>... try again ? <❌>`), ephemeral: true });
        });
    }
}
