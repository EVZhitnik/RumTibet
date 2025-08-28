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
        this.sliders.hot = new InitSlider('.swiper-directions', {
            slidesPerView: 'auto',  
            spaceBetween: 16,
            grabCursor: true,
            centeredSlides: false,
            simulateTouch: true,
            watchOverflow: false,
            breakpoints: {
                768: { 
                slidesPerView: 3,
                spaceBetween: 20,
                }
            }
        }).slider;
    }
}

export default InitSliderCollection;