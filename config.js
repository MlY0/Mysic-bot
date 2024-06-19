module.exports = {
    app: {
        token: '',
        playing: '새벽5시부터 6시까지는 작동하지 않아요',
        global: true,
        guild: '', 
        extraMessages: false,
        loopMessage: false,
        lang: 'ko',
        enableEmojis: false,
    },

    emojis:{
        '이전곡': '⏪',
        '스킵': '⏩',
        'ResumePause': '⏯️',
        'savetrack': '💾',
        'volumeUp': '🔊',
        'volumeDown': '🔉',
        '반복재생': '🔁',
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        Translate_Timeout: 10000,
        maxVol: 100,
        spotifyBridge: false,
        volume: 75,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
