const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { Translate } = require("../../process_tools");

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  let EmojiState = client.config.app.enableEmojis;

  const emojis = client.config.emojis;

  emojis ? EmojiState = EmojiState : EmojiState = false;


  (async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Started playing <${track.title}> in <${queue.channel.name}> <🎧>`
        ),
        iconURL: track.thumbnail,
      })
      .setColor("#2f3136");

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

    const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : ('반복재생'))
      .setCustomId('반복재생')
      .setStyle('Danger');

    const lyrics = new ButtonBuilder()
      .setLabel(await Translate("Lyrics"))
      .setCustomId("lyrics")
      .setStyle("Secondary");

    const row1 = new ActionRowBuilder().addComponents(
      back,
      loop,
      resumepause,
      skip,
      lyrics
    );
    queue.metadata.channel.send({ embeds: [embed], components: [row1] });
  })();
};
