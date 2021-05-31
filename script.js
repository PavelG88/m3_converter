
class Convert {
    constructor() {
        this.url = 'http://api.exchangeratesapi.io/v1/latest?';
        this.apiKey = 'ccc57ef6f9aa2f4b6dd2f9a79df64055';
        this.currensyChoiceSale = document.querySelector('.sale__selected');
        this.currensyChoiceBuy = document.querySelector('.buy__selected');
        this.actionChoice = document.querySelector('.action-selected');
        this.fieldValueCurrensySale = document.querySelector('[name="sale"]');
        this.fieldValueCurrensyBuy = document.querySelector('[name="buy"]');
        this.fieldForexSale = document.querySelector('.sale__forex');
        this.fieldForexBuy = document.querySelector('.buy__forex');
        this.forexSale = 0;
        this.forexBuy = 0;
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
                if (this.actionChoice.dataset.action === 'sale') {
                    this.isSale = true;
                } else {
                    this.isSale = false;
                }
                this.GetExchangeRateFromServer(this.currensyChoiceSale.dataset.currency, this.currensyChoiceBuy.dataset.currency);
                this.renderWorkSpace();
            })
        });
     }
    /**
     * Добавить обработчик событий при изменении валюты
     */
    setEventListenerForSelectedCurrensy() {
        let currensiesSale = document.querySelectorAll('.sale__button_currency');
        let currensiesBuy = document.querySelectorAll('.buy__button_currency');
        
        currensiesSale.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoiceSale.classList.remove('sale__selected');
                this.currensyChoiceSale = event.target;
                this.currensyChoiceSale.classList.add('sale__selected');
                this.GetExchangeRateFromServer(this.currensyChoiceSale.dataset.currency, this.currensyChoiceBuy.dataset.currency);
            })
        });

        currensiesBuy.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoiceBuy.classList.remove('buy__selected');
                this.currensyChoiceBuy = event.target;
                this.currensyChoiceBuy.classList.add('buy__selected');
                this.GetExchangeRateFromServer(this.currensyChoiceSale.dataset.currency, this.currensyChoiceBuy.dataset.currency);
            })
        });
    }

    /**
     * Добавить обработчик событий при вводе суммы для обмена
     */
    setEventListenerForInput() {
        this.fieldValueCurrensySale.addEventListener('input', () => {
            this.updateInfo(true);
        });

        this.fieldValueCurrensyBuy.addEventListener('input', () => {
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
            this.forexSale = this.forexBuy = 1;
            this.updateInfo();
            return;
        }
        
        let messageError = document.querySelector('.main__error');
        messageError.textContent = '';
        
        fetch(this.url+`access_key=${this.apiKey}&base=${base}&symbols=${symbol}`)
            .then(request => request.json())
            .then(data => {
                // console.log(data.rates[symbol]);
                this.forexSale = data.rates[symbol];
                this.forexBuy = 1 / this.forexSale;
                this.updateInfo();
            })
            .catch(error => {
                messageError.textContent = 'Что-то пошло не так. Попробуйте ещё раз';
                this.forexSale = this.forexBuy = 0;
                this.updateInfo();
                console.log(error);
            })
    }

    /**
     * Обновление информации на странице
     * @param {*} isCurrencyAvailable Изменяем основную валюты, относительно которой считаем (по умолчанию TRUE)
     */
    updateInfo(isCurrencyAvailable = true) {
        this.fieldForexSale.textContent = `1 ${this.currensyChoiceSale.textContent} = ${this.forexSale.toFixed(4)} ${this.currensyChoiceBuy.textContent}`;
        this.fieldForexBuy.textContent = `1 ${this.currensyChoiceBuy.textContent} = ${this.forexBuy.toFixed(4)} ${this.currensyChoiceSale.textContent}`;
        isCurrencyAvailable = this.isSale ? true : false;
        if (isCurrencyAvailable) {
            this.fieldValueCurrensyBuy.value = this.roundNumber((this.fieldValueCurrensySale.value * this.forexSale));
        } else {
            this.fieldValueCurrensySale.value = this.roundNumber((this.fieldValueCurrensyBuy.value * this.forexBuy));
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
        let saleText = document.querySelector('.sale__text');
        let buyText = document.querySelector('.buy__text');
        let workSpaceSale = document.querySelector('.work-space__sale');
        let workSpace = document.querySelector('.main__work-space');
        workSpaceSale.remove();
        
        if(this.isSale) {
            workSpace.prepend(workSpaceSale);
            saleText.textContent = 'У меня есть';
            buyText.textContent = 'Хочу приобрести';
        } else {
            workSpace.append(workSpaceSale);
            saleText.textContent = 'Для покупки мне нужно';
            buyText.textContent = 'Хочу приобрести';
        }
    }

    init() {
        this.GetExchangeRateFromServer(this.currensyChoiceSale.dataset.currency, this.currensyChoiceBuy.dataset.currency);
        this.setEventListenerForSelectedCurrensy();
        this.setEventListenerForSelectedAction();
        this.setEventListenerForInput();
    }
}

let convert = new Convert();
convert.init();