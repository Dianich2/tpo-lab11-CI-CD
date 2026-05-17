const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const { spawn } = require("child_process");

jest.setTimeout(60000);

let server;
let driver;

beforeAll(async () => {
    server = spawn("npx", ["http-server", ".", "-p", "3000"], {
        shell: true,
        stdio: "inherit"
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const service = new chrome.ServiceBuilder(chromedriver.path);

    const options = new chrome.Options();

    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeService(service)
        .setChromeOptions(options)
        .build();
}, 60000);

afterAll(async () => {
    if (driver) {
        await driver.quit();
    }

    if (server) {
        server.kill();
    }
});

test("Page title should be correct", async () => {
    await driver.get("http://127.0.0.1:3000");

    const title = await driver.findElement(By.id("title")).getText();

    expect(title).toBe("Формочка");
});

test("Form fields should exist", async () => {
    await driver.get("http://127.0.0.1:3000");

    const nameInput = await driver.findElement(By.id("name"));
    const emailInput = await driver.findElement(By.id("email"));
    const messageInput = await driver.findElement(By.id("message"));

    expect(await nameInput.isDisplayed()).toBe(true);
    expect(await emailInput.isDisplayed()).toBe(true);
    expect(await messageInput.isDisplayed()).toBe(true);
});

test("Submit button should have correct text", async () => {
    await driver.get("http://127.0.0.1:3000");

    const buttonText = await driver.findElement(By.id("submit-button")).getText();

    expect(buttonText).toBe("Отправить");
});

test("Form submit should show success message", async () => {
    await driver.get("http://127.0.0.1:3000");

    await driver.findElement(By.id("name")).sendKeys("Диана");
    await driver.findElement(By.id("email")).sendKeys("test@example.com");
    await driver.findElement(By.id("message")).sendKeys("Тестовое сообщение");

    await driver.findElement(By.id("submit-button")).click();

    const result = await driver.wait(
        until.elementLocated(By.id("result")),
        5000
    );

    const text = await result.getText();

    expect(text).toBe("Форма успешно отправлена");
});