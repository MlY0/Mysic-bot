const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '대기열건너뛰기',
    description:("대기열의 특정 트랙으로 건너뜁니다"),
    voiceChannel: true,
    options: [
        {
            name: '음악',
            description:('The name/url of the track you want to skip to'),
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: '번호',
            description:('The place in the queue the song is in'),
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const track = inter.options.getString('음악');
        const number = inter.options.getNumber('번호')
        if (!track && !number) return inter.editReply({ content: await Translate(`You have to use one of the options to jump to a song <${inter.member}>... try again ? <❌>`) });

        let trackName;

        if (track) {
            const skipTo = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track)
            if (!skipTo) return inter.editReply({ content: await Translate(`Could not find <${track}> <${inter.member}>... try using the url or the full name of the song ? <❌>`) });

            trackName = skipTo.title;

            queue.node.skipTo(skipTo);
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`This track does not seem to exist <${inter.member}>... try again ? <❌>`) });

            trackName = name;

            queue.node.skipTo(index);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Skipped to <${trackName}> <✅>`) })
            .setColor('#2f3136')

        inter.editReply({ embeds: [embed] });
    }
}
