class Fancybox {
    selector = {
        root: '[data-fancybox="gallery"]'
    }

    constructor() {
        this.init();
    }

    bindFancybox = () => {
        window.Fancybox.bind(this.selector.root, {
            Carousel: {
                Thumbs: {
                    autoStart: true,
                },
                Toolbar: {
                    display: {
                        left: ['counter'],
                        middle: [],
                        right: ['zoomIn', 'zoomOut', 'rotateCCW', 'rotateCW', 'thumbs', 'close'],
                    },
                },
            },
            hideScrollbar: true,
            keyboard: {
                Escape: "close",
                ArrowRight: "next",
                ArrowLeft: "prev",
            },
            on: {
                ready: (fancybox) => {
                },
            },
        });
    }

    init() {
        document.addEventListener('DOMContentLoaded', this.bindFancybox);
    }
}

export default Fancybox;