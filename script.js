const url = 'http://api.exchangeratesapi.io/v1/latest?';
const apiKey = 'ccc57ef6f9aa2f4b6dd2f9a79df64055';

class Convert {
    constructor() {
        this.currensyChoisToSale = document.querySelector('.sale__select');
        this.currensyChoisToBuy = document.querySelector('.buy__select');
        this.fieldValueCurrensyToSale = document.querySelector('[name="sale"]');
        this.fieldValueCurrensyToBuy = document.querySelector('[name="buy"]');
        this.fieldForexToSale = document.querySelector('.sale__forex');
        this.fieldForexToBuy = document.querySelector('.buy__forex');
        this.forexToSale = 0;
        this.forexToBuy = 0;
    }

    setEventListenerForSelectCurrensy() {
        let currensiesToSale = document.querySelectorAll('.sale__button_currency');
        let currensiesToBuy = document.querySelectorAll('.buy__button_currency');
        
        currensiesToSale.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoisToSale.classList.remove('sale__select');
                this.currensyChoisToSale = event.target;
                this.currensyChoisToSale.classList.add('sale__select');
                this.geneateRequest(this.currensyChoisToSale.textContent, this.currensyChoisToBuy.textContent);
                this.updateInfo(true);
            })
        });

        currensiesToBuy.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoisToBuy.classList.remove('buy__select');
                this.currensyChoisToBuy = event.target;
                this.currensyChoisToBuy.classList.add('buy__select');
                this.geneateRequest(this.currensyChoisToBuy.textContent, this.currensyChoisToSale.textContent);
                this.updateInfo(false);
            })
        });
    }

    setEventListenerForInput() {
        this.fieldValueCurrensyToSale.addEventListener('input', () => {
            this.updateInfo(true);
        });

        this.fieldValueCurrensyToBuy.addEventListener('input', () => {
            this.updateInfo(false);
        });
    }

    geneateRequest(base='EUR', symbol='USD')  {
        if (base === symbol) {
            this.forexToSale = this.forexToBuy = 1;
            return;
        }
        
        fetch(url+`access_key=${apiKey}&base=${base}&symbols=${symbol}`)
            .then(request => request.json())
            .then(data => {
                // console.log(data.rates[symbol]);
                this.forexToSale = data.rates[symbol];
                this.forexToBuy = 1 / this.forexToSale;
                this.updateInfo();
            })
            .catch(error => {
                alert('Что-то пошло не так. Попробуйте ещё раз');
                console.log(error);
            })
    }

    updateInfo(isSale = true) {
        this.fieldForexToSale.textContent = `1 ${this.currensyChoisToSale.textContent} = ${this.forexToSale} ${this.currensyChoisToBuy.textContent}`;
        this.fieldForexToBuy.textContent = `1 ${this.currensyChoisToBuy.textContent} = ${this.forexToBuy} ${this.currensyChoisToSale.textContent}`;
        if (isSale) {
            this.fieldValueCurrensyToBuy.value = this.fieldValueCurrensyToSale.value * this.forexToSale;
        } else {
            this.fieldValueCurrensyToSale.value = this.fieldValueCurrensyToBuy.value * this.forexToBuy;
        }
    }

    init() {
        this.geneateRequest();
        this.setEventListenerForSelectCurrensy();
        this.setEventListenerForInput();
    }
}

let convert = new Convert();
convert.init();