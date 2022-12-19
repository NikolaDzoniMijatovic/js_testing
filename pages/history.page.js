"use strict";

const { By, Key, until } = require("selenium-webdriver");
const BasePage = require("./base.page");

module.exports = class HistoryPage extends BasePage{
    #driver;

    constructor(webdriver) {
        super(webdriver);
        this.#driver = webdriver;
    }

    goToPage() {
        this.#driver.get('http://shop.qa.rs/history');
    }

    getHistoryTable() {
        return this.#driver.findElement(By.css(''));
    }

    getHistoryRow(packageName) {
        const xpathOrderRow = `//td[contains(., "#${orderNum}")]/parent::tr`;
        return this.getCartTable().findElement(By.xpath(xpathHistoryRow));
    }

    getHistoryStatus
}