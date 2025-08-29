class InitSlider {
    constructor(selector, options) {
        this.selector = selector;
        this.options = options;
        this.slider = null;
        this.init();
    }

    init() {
        this.slider = new Swiper(this.selector, this.options);
        return this.slider;
    }
}

class InitSliderCollection {
    constructor() {
        this.sliders = {};
        this.init();
    }

    init() {
        this.sliders.directions = new InitSlider('.swiper-directions', {
            spaceBetween: 20,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true, 
            },
            breakpoints: {
                0: { 
                    slidesPerView: 'auto',
                    simulateTouch: true,
                },
                768: { 
                    slidesPerView: 3,
                    simulateTouch: false,
                }
            }
        }).slider;
        this.sliders.blog = new InitSlider('.swiper-blog', {
            slidesPerView: 2,
            spaceBetween: 24,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true, 
            },
            grid: {
                rows: 2,
                fill: 'row',
            },
            breakpoints: {
                0: { 
                    slidesPerView: 'auto',
                    simulateTouch: true,
                    grid: { rows: 1 },
                },
                768: {     
                    slidesPerView: 2,
                    simulateTouch: false,
                    grid: { rows: 2 },
                },
            },
        }).slider;
    }
}

export default InitSliderCollection;