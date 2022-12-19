"use strict";

const { expect } = require("chai");
const { By, Key, until } = require("selenium-webdriver");

module.exports = class HomePage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    goToPage() {
        this.#driver.get("http://shop.qa.rs");
    }

    getPageHeaderTitle() {
        this.#driver.findElement(By.css('h1')).getText();
    }

    getWelcomeBackTitle() {
        return this.#driver.findElement(By.css('h2')).getText();
    }

    isBugListDivDisplayed() {
        return this.#driver.findElement(By.xpath('//*[@class="row" and contains(., "ORDER YOUR BUGS TODAY")]')).isDisplayed();
    }

    isLogoutLinkDisplayed() {
        return this.#driver.findElement(By.partialLinkText('Logout')).isDisplayed();
    }

    isLoginLinkDisplayed() {
        return this.#driver.findElement(By.partialLinkText('Login')).isDisplayed();
    }

    clickOnRegisterLink() {
        const registerLink = this.#driver.findElement(By.linkText('Register'));
        registerLink.click();
    }

    getSuccessAlertText() {
        return this.#driver.findElement(By.className('alert alert-success')).getText();
    }

    async clickOnLoginLink() {
        const loginLink = await this.#driver.findElement(By.linkText('Login'));
        await loginLink.click();
    }

    getPackageDiv(title) {
        const xPathPackage = `//h3[contains(text(), "${title}")]/ancestor::div[constains(@class, "panel")]`;
        return this.#driver.findElement(By.xpath(xPathPackage));
    }

    getQuantityDropDown(packageDiv) {
        return packageDiv.findElement(By.name('quantity'));
    }

    getQuantityOptions(quantityDropDown) {
        return quantityDropDown.findElements(By.css('option'));
    }

    getOrderButton(packageDiv) {
        return packageDiv.findElement(By.className('btn btn-primary'));
    }

    async clickOnViewShoppingCartLink() {
        const linkShoppingCart = await this.#driver.findElement(By.partialLinkText('shopping cart'));

        await linkShoppingCart.click();
    }
}