"use strict";

const { By, Key, until } = require("selenium-webdriver");

module.exports = class BasePage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    async clickOnGetOrderHistoryLink() {
        const orderHistoryLink = await this.#driver.findElement(By.linkText('Order history'));
    }

    getPageHeaderTitle() {
        return this.#driver.findElement(By.css('h1'));
    }

    async clickOnLogoutLink() {
        const logoutLink = await this.#driver.findElement(By.partialLinkText('Login'));
        await logoutLink.click();
    }
}