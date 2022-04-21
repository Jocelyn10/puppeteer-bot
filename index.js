const puppeteer = require('puppeteer');
const dotEnv = require('dotenv');
dotEnv.config();

const getInstagramPreview = async (link) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');
  await page.waitForSelector('input[name="username"]');

  await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME);
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();

  // We can comment the following line if we want to see the preview only for Instragram
  await page.goto(link);

  await page.evaluate(() => document.querySelector('*').outerHTML);

  let data = {};

  // Be sure to use the correct selector for the data you want to scrape

  data.title = await page.$eval(
    "head > meta[property='og:title']",
    (element) => element.content
  );

  data.description = await page.$eval(
    "head > meta[property='og:description']",
    (element) => element.content
  );

  data.image = await page.$eval(
    "head > meta[property='og:image']",
    (element) => element.content
  );

  data.url = await page.$eval(
    "head > meta[property='og:url']",
    (element) => element.content
  );

  data.type = await page.$eval(
    "head > meta[property='og:type']",
    (element) => element.content
  );

  data.logo = await page.$eval(
    "head > link[rel='apple-touch-icon-precomposed']",
    (element) => element.href
  );

  await browser.close();

  console.log('View datas collected : ', data);

  return data;
};

getInstagramPreview();
