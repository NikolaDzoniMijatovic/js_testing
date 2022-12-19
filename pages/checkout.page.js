"use strict";

const { By, Key, until } = require("selenium-webdriver");
const BasePage = require("./base.page");

module.exports = class CheckoutPage extends BasePage{
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    goToPage() {
        this.#driver.get('http://shop.qa.rs/cart');
    }

    getCheckoutSuccessTitle() {
        return this.#driver.findElement(By.css('h2')).getText();
    }

    async getCheckoutOrderNumber() {
        return (await this.getCheckoutSuccessTitle()).replace(/\D/g, '');
    }
}