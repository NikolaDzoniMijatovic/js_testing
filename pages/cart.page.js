"use strict";

const { By, Key, until } = require("selenium-webdriver");

module.exports = class CartPage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    goToPage() {
        this.#driver.get('http://shop.qa.rs/cart');
    }

    getPageHeaderTitle() {
        this.#driver.findElement(By.css('h1')).getText();
    }

    getCartTable() {
        return this.#driver.findElement(By.css('table'));
    }

    getOrderRow(packageName) {
        const xpathOrderRow = `//td[contains(., "${packageName.toUpperCase()}")]/parent::tr`;
        return this.getCartTable().findElement(By.xpath(xpathOrderRow));
    }

    getItemQuantity(orderRow) {
        return orderRow.findElement(By.xpath('td[2]'));
    }

    getItemPrice(orderRow) {
        return orderRow.findElement(By.xpath('td[3]'));
    }

    getItemPriceTotal(orderRow) {
        return orderRow.findElement(By.xpath('td[4]'));
    }

    async clickOnCheckoutButton() {
        const btn = this.#driver.findElement(By.name('checkout'));
        await btn.click();
    }
}