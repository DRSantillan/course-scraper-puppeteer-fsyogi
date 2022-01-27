import puppeteer from 'puppeteer';
import { createFile, createFolder } from './util/utilities.js';
import dotenv from 'dotenv';

dotenv.config();
//
const createSnapShot = async (page, folderPath, folder) => {
	if (folder && folderPath) {
		await page.screenShot({
			path: `./${folderPath}/${folder}.png`,
			fullPage: true,
		});
	}
	await page.screenshot({
		path: `./${folderPath}/all-courses.png`,
		fullPage: true,
	});
};
//
const loginToSite = async page => {
	await page.goto('https://sso.teachable.com/secure/441520/identity/login');
	await page.type('input[id=email]', process.env.USERNAME);
	await page.type('input[id=password]', process.env.PASSWORD);
	await page.click('input[type=submit]');
	await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
};

//
const getCourseData = async page => {
	const courseLink = await page.$eval('a', courseLink => courseLink.href);
	const courseTitle = await page.$eval(
		'.course-listing-title',
		courseTitle => courseTitle.textContent
	);

	return {
		link: courseLink,
		title: courseTitle,
	};
};
const getAllCourses = async page => {
	const CSS_SELECTOR = '.row';
	const courses = await page.$$(CSS_SELECTOR);
	const allCourses = [];

	for (const course of courses) {
        
		const courseData = await getCourseData(page);
		allCourses.push(courseData);
	}

	//console.log(allCourses);
	return allCourses;
};

const scraperMain = async () => {
	// setup an execution context for puppeteer
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(10000);

	// Login to site
	await loginToSite(page);

	// take a snapshot of the course page
	await createSnapShot(page, 'courses');

	// get the page content and save to the main directory
	await createFile('courses', 'index.html', await page.content());

	// Get all the courses on the main course page
	const coursesList = await getAllCourses(page);
	console.log(coursesList);

	// shut down the connection
	await browser.close();
};

await scraperMain();
