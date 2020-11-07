const player = videojs('videoPlayer', {
    controls: true,
    autoplay: false,
    preload: 'auto',
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    fluid: true,
    aspectRatio: '4:3',
    plugins: {
        hotkeys: {
            enableModifiersForNumbers: false
        }
    }
});

/*
const Component = videojs.getComponent('Component');

class TitleBar extends Component {
    constructor(player, options) {
        super(arguments);

        if (options.text) {
            this.updateTextContent(options.text);
        }
    };

    createEl() {
        return videojs.dom.createEl('div', {
            className: 'vjs-title-bar'
        });
    };

    updateTextContent(text) {
        if (typeof text !== 'string') {
            text = 'Title Unknown';
        }
        videojs.dom.emptyEl(this.el());
        videojs.dom.appendContent(this.el(), text);
    }
}

videojs.registerComponent('TitleBar', TitleBar);
player.addChild('TitleBar', {text: 'The Title of The Video!'});
*/