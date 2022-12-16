"use strict";

const { By, Key, until } = require("selenium-webdriver");

module.exports = class LoginPage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    goToPage() {
        this.#driver.get("http://shop.qa.rs/login");
    }

    getInputUserName() {
        return this.#driver.findElement(By.name('username'));
    }

    getInputPassword() {
        return this.#driver.findElement(By.name('password'));
    }

    async clickOnLoginButton() {
        const buttonLogin = this.#driver.findElement(By.name('login'));
        buttonLogin.click();
    }
}