const rootSelector = '[data-js-slider]';

class Slider {
    selectors = {
        container: '[data-js-slider-container]',
        wrapper: '[data-js-slider-wrapper]',
        slides: '[data-js-slider-slide]'
    }

    breackpoint = 768;
    minSwipeDistance = 50;
    maxSwipeVelocity = 0.5;
    autoPlayInterval = 3000;

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.containerElement = this.rootElement.querySelector(this.selectors.container);
        this.wrapperElement = this.rootElement.querySelector(this.selectors.wrapper);
        this.slidesElements = this.rootElement.querySelectorAll(this.selectors.slides);

        this.currentSlideIndex = 0;
        this.startOfTouch = 0;
        this.endOfTouch = 0;
        this.isDragging = false;
        this.touchStartTime = 0;
        this.velocity = 0;
        this.autoPlayTimer = null;
        this.resizeTimeout = null;

        this.init();
    }

    isMobile = () => {
        return window.innerWidth < this.breackpoint;
    }

    calcMetrics = () => {
        this.wrapperElement.style.width = '';
        this.wrapperElement.style.boxSizing = '';

        this.slideWidth = this.slidesElements[0].offsetWidth;

        const wrapperStyle = getComputedStyle(this.wrapperElement);
        const gapStr = wrapperStyle.getPropertyValue('column-gap') || wrapperStyle.getPropertyValue('gap') || '0px';
        this.gap = parseFloat(gapStr) || 0;

        const padLeft = parseFloat(wrapperStyle.getPropertyValue('padding-left')) || 0;
        const padRight = parseFloat(wrapperStyle.getPropertyValue('padding-right')) || 0;
        this.paddingLeft = padLeft;
        this.paddingRight = padRight;

        const count = this.slidesElements.length;
        const contentWidth = this.slideWidth * count + this.gap * Math.max(0, count - 1);

        this.totalWidth = contentWidth + this.paddingLeft + this.paddingRight;
    }

    setupMobileSlider = () => {
        this.calcMetrics();

        this.wrapperElement.style.transition = 'transform 0.3s ease';
        this.wrapperElement.style.width = `${this.totalWidth}px`;

        this.updateSliderPosition();
        this.addTouchEvents();
        this.startAutoPlay();
        this.addHoverEvents();
        this.addVisibilityEvents();
        this.addKeyboardEvents();
    }

    setupDesktop = () => {
        this.wrapperElement.removeAttribute('style');
        this.removeTouchEvents();
        this.stopAutoPlay();
        this.removeHoverEvents();
        this.removeVisibilityEvents();
        this.addKeyboardEvents();
    }

    updateSliderPosition = () => {
        const maxTranslate = Math.max(0, this.totalWidth - this.containerElement.clientWidth);

        const target = this.currentSlideIndex * (this.slideWidth + this.gap);
        const used = Math.min(target, maxTranslate);

        const translateX = -used;
        this.wrapperElement.style.transform = `translateX(${translateX}px)`;
    }

    startAutoPlay = () => {
        if (this.slidesElements.length <= 1) return;
        
        this.stopAutoPlay();

        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }

    stopAutoPlay = () => {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    restartAutoPlay = () => {
        this.startAutoPlay();
    }

    handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            this.stopAutoPlay();
        } else {
            this.restartAutoPlay();
        }
    }

    onTouchStart = (event) => {
        if (!event.touches || event.touches.length === 0) return;
        this.isDragging = true;

        this.startOfTouch = event.touches[0].clientX;
        this.endOfTouch = this.startOfTouch;
        this.hasMoved = false;

        this.touchStartTime = Date.now();
        this.wrapperElement.style.transition = 'none';
        this.wrapperElement.style.cursor = 'grabbing';

        this.stopAutoPlay();
    }

    onTouchMove = (event) => {
        if (!this.isDragging) return;
        if (!event.touches || event.touches.length === 0) return;

        event.preventDefault();

        this.endOfTouch = event.touches[0].clientX;
        const diff = this.startOfTouch - this.endOfTouch;

        if (Math.abs(diff) > 5) {
            this.hasMoved = true;
        }

        const currentPosition = -this.currentSlideIndex * (this.slideWidth + this.gap);
        this.wrapperElement.style.transform = `translateX(${currentPosition - diff}px)`;
    }

    onTouchEnd = () => {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.wrapperElement.style.cursor = 'grab';
        this.wrapperElement.style.transition = 'transform 0.3s ease';

        const touchEndTime = Date.now();
        const timeDiff = touchEndTime - this.touchStartTime;
        const diff = this.startOfTouch - this.endOfTouch;

        this.velocity = timeDiff > 0 ? diff / timeDiff : 0;

        if (Math.abs(diff) > this.minSwipeDistance) {
            this.velocity = this.maxSwipeVelocity * Math.sign(this.velocity);
        }

        if (!this.hasMoved) {
            this.updateSliderPosition();
        } else {
            this.handleSwipeResult(diff);
        }

        setTimeout(() => {
            this.restartAutoPlay();
        }, 5000);
    }

    handleSwipeResult = (diff) => {
        const swipeDistance = Math.abs(diff);
        const isFastSwipe = Math.abs(this.velocity) > 0.1;

        if (swipeDistance > this.minSwipeDistance || isFastSwipe) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        } else {
            this.updateSliderPosition();
        }
    }

    nextSlide = () => {
        if (this.currentSlideIndex < this.slidesElements.length - 1) {
            this.currentSlideIndex++;
        } else {
            this.currentSlideIndex = 0;
        }

        this.updateSliderPosition();
    }

    prevSlide = () => {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
        } else {
            this.currentSlideIndex = this.slidesElements.length - 1;
        }

        this.updateSliderPosition();
    }

    goToSlide = (index) => {
        if (index >= 0 && index < this.slidesElements.length) {
            this.currentSlideIndex = index;
            this.updateSliderPosition();
        }
    }

    handleKeyDown = (event) => {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.slidesElements.length - 1);
                break;
        }
    }

    addKeyboardEvents = () => {
        this.rootElement.addEventListener('keydown', this.handleKeyDown);
    }

    removeKeyboardEvents = () => {
        this.rootElement.removeEventListener('keydown', this.handleKeyDown);
    }

    addHoverEvents = () => {
        this.rootElement.addEventListener('mouseenter', this.stopAutoPlay);
        this.rootElement.addEventListener('mouseleave', this.restartAutoPlay);
    }

    removeHoverEvents = () => {
        this.rootElement.removeEventListener('mouseenter', this.stopAutoPlay);
        this.rootElement.removeEventListener('mouseleave', this.restartAutoPlay);
    }

    addVisibilityEvents = () => {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    removeVisibilityEvents = () => {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    addTouchEvents = () => {
        this.wrapperElement.addEventListener('touchstart', this.onTouchStart);
        this.wrapperElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.wrapperElement.addEventListener('touchend', this.onTouchEnd);
    }

    removeTouchEvents = () => {
        this.wrapperElement.removeEventListener('touchstart', this.onTouchStart);
        this.wrapperElement.removeEventListener('touchmove', this.onTouchMove, { passive: false });
        this.wrapperElement.removeEventListener('touchend', this.onTouchEnd);
    }

    checkViewport = () => {
        this.isMobile() ? this.setupMobileSlider() : this.setupDesktop();
    }

    handleResize = () => {
        clearTimeout(this.resizeTimeout);

        this.resizeTimeout = setTimeout(() => {
            this.checkViewport();
        }, 250);
    }

    init() {
        this.checkViewport();
        window.addEventListener('resize', this.handleResize);
    }
}

class SliderCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(element => {
            new Slider(element);
        })
    }
}

export default SliderCollection;