const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const methods = ['비활성화', '트랙', '대기열가져오기'];
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });

    if (queue.repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)
    else queue.setRepeatMode(queue.repeatMode + 1)

    return inter.editReply({ content: await Translate(`Loop made has been set to <**${methods[queue.repeatMode]}**>.<✅>`) });
}