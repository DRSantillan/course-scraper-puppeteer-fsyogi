import puppeteer from 'puppeteer';

const createSnapShot = async (page, folderPath, folder) => {
	await page.screenShot({
		path: `./${folderPath}/${folder}.png`,
		fullPage: true,
	});
};

const scraperMain = async () => {};

await scraperMain();
