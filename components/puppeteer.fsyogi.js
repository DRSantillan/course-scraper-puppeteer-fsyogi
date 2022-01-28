import puppeteer from 'puppeteer';
import { createFolder } from '../util/utilities.js';

export const loginToSite = async page => {
	await page.goto('https://sso.teachable.com/secure/441520/identity/login');
	await page.type('input[id=email]', process.env.USERNAME);
	await page.type('input[id=password]', process.env.PASSWORD);
	await page.click('input[type=submit]');
	await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
};

export const initializePuppeteer = async () => {
	// setup an execution context for puppeteer
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(15000);

	return { page, browser };
};

export const createScreenShot = async (page, folderPath, folder) => {
	createFolder(folderPath);
	if (folder && folderPath) {
		await page.screenshot({
			path: `./${folderPath}/${folder}.png`,
			fullPage: true,
		});
	}
	await page.screenshot({
		path: `./${folderPath}/all-courses.png`,
		fullPage: true,
	});
};
