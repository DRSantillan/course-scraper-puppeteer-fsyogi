import puppeteer from 'puppeteer';
import { createFolder, createFile } from '../util/utilities.js';

export const loginToSite = async page => {
	await page.goto('https://sso.teachable.com/secure/441520/identity/login');
	await page.type('input[id=email]', process.env.USERNAME);
	await page.type('input[id=password]', process.env.PASSWORD);
	await page.click('input[type=submit]');
	await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
};

export const createPDFFile = async (page, folderPath, folder) => {
	if (folder && folderPath) {
		await page.pdf({
			path: `./${folderPath}/${folder}.pdf`,
			format: 'A4',
		});
	} else {
		await page.pdf({
			path: `./${folderPath}/all-courses.pdf`,
			format: 'A4',
		});
	}
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
			path: `./${folderPath}/${folder}-screenshot.png`,
			fullPage: true,
		});
	} else {
		await page.screenshot({
			path: `./${folderPath}/all-courses.png`,
			fullPage: true,
		});
	}
};

export const savePDFHTMLPNG = async (page, folderPath, folder) => {
	// logging console
	console.log(`>> Saving Html file................`);
	// create html file
	createFile(folderPath, 'index.html', await page.content());
	// logging console
	console.log(`>> Taking a Screenshot................`);
	await createScreenShot(page, folderPath, folder);
	console.log(`>> Creating a PDF File................`);
	//create pdf file
	await createPDFFile(page, folderPath, folder);
};
