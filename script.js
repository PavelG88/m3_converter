
class Convert {
    constructor() {
        this.url = 'http://api.exchangeratesapi.io/v1/latest?';
        this.apiKey = 'ccc57ef6f9aa2f4b6dd2f9a79df64055';
        this.currensyChoiceBase = document.querySelector('.base__selected');
        this.currensyChoiceAdditional = document.querySelector('.additional__selected');
        this.actionChoice = document.querySelector('.action-selected');
        this.fieldValueCurrensyBase = document.querySelector('[name="base"]');
        this.fieldValueCurrensyAdditional = document.querySelector('[name="additional"]');
        this.fieldForexBase = document.querySelector('.base__forex');
        this.fieldForexAdditional = document.querySelector('.additional__forex');
        this.forexBase = 0;
        this.forexAdditional = 0;
        this.isSale = true;
    }
 
    /**
     * Добавить обработчик событий при выборе действия с валютой валюты
     */
     setEventListenerForSelectedAction() {
        let actionsWithCurrency = document.querySelectorAll('.selecting-currency-action__button');
        actionsWithCurrency.forEach((action) => {
            action.addEventListener('click', (event) => {
                this.actionChoice.classList.remove('action-selected');
                this.actionChoice = event.target;
                this.actionChoice.classList.add('action-selected');
                if (this.actionChoice.dataset.action === 'base') {
                    this.isSale = true;
                } else {
                    this.isSale = false;
                }
                this.GetExchangeRateFromServer(this.currensyChoiceBase.dataset.currency, this.currensyChoiceAdditional.dataset.currency);
                this.renderWorkSpace();
            })
        });
     }
    /**
     * Добавить обработчик событий при изменении валюты
     */
    setEventListenerForSelectedCurrensy() {
        let currensiesBase = document.querySelectorAll('.base__button_currency');
        let currensiesAdditional = document.querySelectorAll('.additional__button_currency');
        
        currensiesBase.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoiceBase.classList.remove('base__selected');
                this.currensyChoiceBase = event.target;
                this.currensyChoiceBase.classList.add('base__selected');
                this.GetExchangeRateFromServer(this.currensyChoiceBase.dataset.currency, this.currensyChoiceAdditional.dataset.currency);
            })
        });

        currensiesAdditional.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoiceAdditional.classList.remove('additional__selected');
                this.currensyChoiceAdditional = event.target;
                this.currensyChoiceAdditional.classList.add('additional__selected');
                this.GetExchangeRateFromServer(this.currensyChoiceBase.dataset.currency, this.currensyChoiceAdditional.dataset.currency);
            })
        });
    }

    /**
     * Добавить обработчик событий при вводе суммы для обмена
     */
    setEventListenerForInput() {
        this.fieldValueCurrensyBase.addEventListener('input', () => {
            this.updateInfo(true);
        });

        this.fieldValueCurrensyAdditional.addEventListener('input', () => {
            this.updateInfo(false);
        });
    }

    /**
     * Запрос курса валюты на сервере
     * @param {*} base Валюта, которую хотим поменять
     * @param {*} symbol Валюта, на которую хотим поменять
     */
    GetExchangeRateFromServer(base, symbol)  {
        if (base === symbol) {
            this.forexBase = this.forexAdditional = 1;
            this.updateInfo();
            return;
        }
        
        let messageError = document.querySelector('.main__error');
        messageError.textContent = '';
        
        fetch(this.url+`access_key=${this.apiKey}&base=${base}&symbols=${symbol}`)
            .then(request => request.json())
            .then(data => {
                // console.log(data.rates[symbol]);
                this.forexBase = data.rates[symbol];
                this.forexAdditional = 1 / this.forexBase;
                this.updateInfo();
            })
            .catch(error => {
                messageError.textContent = 'Что-то пошло не так. Попробуйте ещё раз';
                this.forexBase = this.forexAdditional = 0;
                this.updateInfo();
                console.log(error);
            })
    }

    /**
     * Обновление информации на странице
     * @param {*} isCurrencyAvailable Изменяем основную валюты, относительно которой считаем (по умолчанию TRUE)
     */
    updateInfo(isCurrencyAvailable = true) {
        this.fieldForexBase.textContent = `1 ${this.currensyChoiceBase.textContent} = ${this.forexBase.toFixed(4)} ${this.currensyChoiceAdditional.textContent}`;
        this.fieldForexAdditional.textContent = `1 ${this.currensyChoiceAdditional.textContent} = ${this.forexAdditional.toFixed(4)} ${this.currensyChoiceBase.textContent}`;
        if (isCurrencyAvailable) {
            this.fieldValueCurrensyAdditional.value = this.roundNumber((this.fieldValueCurrensyBase.value * this.forexBase));
        } else {
            this.fieldValueCurrensyBase.value = this.roundNumber((this.fieldValueCurrensyAdditional.value * this.forexAdditional));
        }
    }

    /**
     * Округление до 4 знаков после запятой
     * @param {*} number Числок, которое округляем
     * @returns Округленное число
     */
    roundNumber(number) {
        //сколько знаков после запятой нужно
        let i = 4;
        return Math.round(number * (10 ** i)) / (10 ** i)
    }
    
    /**
     * Обновление области ввода в зависимости от продаем или покупаем
     */
    renderWorkSpace() {
        let baseText = document.querySelector('.base__text');
        let additionalText = document.querySelector('.additional__text');
        
        if(this.isSale) {
            baseText.textContent = 'У меня есть';
            additionalText.textContent = 'Хочу приобрести';
        } else {
            baseText.textContent = 'Хочу приобрести';
            additionalText.textContent = 'Для покупки мне нужно';
        }
    }

    init() {
        this.GetExchangeRateFromServer(this.currensyChoiceBase.dataset.currency, this.currensyChoiceAdditional.dataset.currency);
        this.setEventListenerForSelectedCurrensy();
        this.setEventListenerForSelectedAction();
        this.setEventListenerForInput();
    }
}

let convert = new Convert();
convert.init();