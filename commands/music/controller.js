const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: '컨트롤러',
    description:("채널에 음악 컨트롤러 보내기"),
    voiceChannel: false,
    permissions: PermissionsBitField.Flags.ManageMessages,
    options: [
        {
            name: 'channel',
            description:('The text channel you want to send it to'),
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    async execute({ inter }) {
        const channel = inter.options.getChannel('channel');
        if (channel.type !== ChannelType.GuildText) return inter.editReply({ content: await Translate(`You need to send it to a text channel.. <❌>`) });

        const embed = new EmbedBuilder()
            .setTitle(await Translate('Control your music with the buttons below !'))
            .setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
            .setColor('#2f3136')
            .setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ content: await Translate(`Sending controller to <${channel}>... <✅>`) });

        let EmojiState = client.config.app.enableEmojis;

        const emojis = client.config.emojis;

        emojis ? EmojiState = EmojiState : EmojiState = false;

        const back = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.back : ('이전곡'))
            .setCustomId('이전곡')
            .setStyle('Primary');

        const skip = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.skip : ('스킵'))
            .setCustomId('스킵')
            .setStyle('Primary');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : ('Resume & Pause'))
            .setCustomId('resume&pause')
            .setStyle('Danger');

        const save = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('저장'))
            .setCustomId('savetrack')
            .setStyle('Success');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : ('Volume Up'))
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : ('Volume Down'))
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : ('반복재생'))
            .setCustomId('반복재생')
            .setStyle('Danger');

        const np = new ButtonBuilder()
            .setLabel('Now Playing')
            .setCustomId('재생정보')
            .setStyle('Secondary');

        const queuebutton = new ButtonBuilder()
            .setLabel('대기열가져오기')
            .setCustomId('대기열가져오기')
            .setStyle('Secondary');

        const lyrics = new ButtonBuilder()
            .setLabel('가사')
            .setCustomId('가사')
            .setStyle('Primary');

        const shuffle = new ButtonBuilder()
            .setLabel('섞기')
            .setCustomId('섞기')
            .setStyle('Success');

        const stop = new ButtonBuilder()
            .setLabel('멈춤')
            .setCustomId('멈춤')
            .setStyle('Danger');

        const row1 = new ActionRowBuilder().addComponents(back, resumepause, skip, stop, save);
        const row2 = new ActionRowBuilder().addComponents(volumedown, volumeup, loop);
        const row3 = new ActionRowBuilder().addComponents(lyrics, shuffle, queuebutton, np);

        channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
}
