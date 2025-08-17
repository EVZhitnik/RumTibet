const rootSelector = '[data-js-calendar]';

class Calendar {
    selectors = {
        calendarInput: '[data-js-calendar-input]',
        calendarButton: '[data-js-calendar-button]'
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.calendarInputElement = this.rootElement.querySelector(this.selectors.calendarInput);
        this.calendarButtonElement = this.rootElement.querySelector(this.selectors.calendarButton);
        this.calendar = null;
        this.init();
    }

    validateElements = () => {
        if (!this.calendarInputElement) {
            console.error('Элемент ввода календаря не найден', this.rootElement);
            return false;
        }
        return true;
    }

    initCalendar = () => {
        this.calendar = flatpickr(this.calendarInputElement, {
            locale: "ru",
            dateFormat: "d.m.Y",
            allowInput: true,
            mode: "range",
            static: true,
            monthSelectorType: 'static',
        });
    }

    openCalendar = () => {
        if (this.calendar) {
            this.calendar.open();
        }
    }

    setupEventListeners = () => {
        if (this.calendarButtonElement) {
            this.calendarButtonElement.addEventListener('click', this.openCalendar);
        }
    }

    init() {
        if (!this.validateElements()) return;
        
        try {
            this.initCalendar();
            this.setupEventListeners();
        } catch (error) {
            console.error('Ошибка инициализации календаря:', error);
        }
    }
}

class CalendarCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Calendar(element);
        });
    }
}

export default CalendarCollection;