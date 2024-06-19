const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '점프',
    description:("대기열의 특정 트랙으로 점프합니다"),
    voiceChannel: true,
    options: [
        {
            name: '음악',
            description:('점프할 트랙의 이름/url'),
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: '번호',
            description:('대기열에 있는 번호'),
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const track = inter.options.getString('음악');
        const number = inter.options.getNumber('번호');
        if (!track && !number) inter.editReply({ content: await Translate(`You have to use one of the options to jump to a song <${inter.member}>... try again ? <❌>`) });

        let trackName;
        if (track) {
            const toJump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
            if (!toJump) return inter.editReply({ content: await Translate(`could not find <${track}> <${inter.member}>... try using the url or the full name of the song ? <❌>`) });

            queue.node.jump(toJump);
            trackName = toJump.title;
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`This track does not seem to exist <${inter.member}>...  try again ? <❌>`) });

            queue.node.jump(index);
            trackName = name;
        }

        const jumpEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Jumped to <${trackName}> <✅>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [jumpEmbed] });
    }
}
