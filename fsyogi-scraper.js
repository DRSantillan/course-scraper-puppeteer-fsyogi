import puppeteer from 'puppeteer';
import { createFile } from './util/utilities';

const createSnapShot = async (page, folderPath, folder) => {
	if (folder && folderPath) {
		await page.screenShot({
			path: `./${folderPath}/${folder}.png`,
			fullPage: true,
		});
	}
	await page.screenshot({ path: 'all-courses.png', fullPage: true });
};

const getAllCourses = async (url, page) => {};
const loginToSite = async page => {
	await page.goto('https://sso.teachable.com/secure/441520/identity/login');
	await page.type('input[id=email]', process.env.USERNAME);
	await page.type('input[id=password]', process.env.PASSWORD);
	await page.click('input[type=submit]');
	await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
};
const scraperMain = async () => {
	// setup an execution context for puppeteer
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(10000);

	// Login to site
	await loginToSite(page);
	//await page.screenshot({ path: 'screenshot.png' });

	// take a snapshot of the course page
	await createSnapShot(page);

	// get the page content and save to the main directory
	const courseDirectoryHtml = await page.content();
	await createFile('./courses', 'index.html', await page.content());

	// shut down the connection
	await browser.close();
};

await scraperMain();
