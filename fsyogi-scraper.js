import puppeteer from 'puppeteer';
import {
	createFile,
	createFolder,
	replaceCharacters,
} from './util/utilities.js';
import dotenv from 'dotenv';

dotenv.config();
//
const createSnapShot = async (page, folderPath, folder) => {
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
//
const loginToSite = async page => {
	await page.goto('https://sso.teachable.com/secure/441520/identity/login');
	await page.type('input[id=email]', process.env.USERNAME);
	await page.type('input[id=password]', process.env.PASSWORD);
	await page.click('input[type=submit]');
	await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
};

// Scrapes all the links and titles from the main course page
const getCoursesLinksAndTitles = async (course, page) => {
	// declare variables
	let courseLink,
		courseTitle = null;

	// get link to the course page
	courseLink = await page.evaluate(el => el.querySelector('a').href, course);

	if (courseLink.includes('?')) return;
	// get title of course
	courseTitle = await page.evaluate(
		el => el.querySelector('.course-listing-title').textContent,
		course
	);
	// return one course title and listing
	return {
		title: replaceCharacters(courseTitle),
		link: courseLink,
	};
};

// function to get all courses on the main course page.
const getAllCourses = async page => {
	// variables
	const CSS_SELECTOR = '.row';
	const allCourses = [];
	let courseData = null;
	// get all divs on the page
	const courses = await page.$$(CSS_SELECTOR);

	// loop through divs to get each course and add to array
	for (const course of courses) {
		courseData = await getCoursesLinksAndTitles(course, page);
		allCourses.push(courseData);
	}
	allCourses.shift();
	allCourses.pop();
	//
	return allCourses;
};

// loop through return courses and create folder and an image snapshot for each course
const createCoursesFoldersAndSnapShot = async (coursesArray, page) => {
	const mainFolder = 'courses';

	for (let course of coursesArray) {
		console.log(course);
		createFolder(mainFolder, course.title);
	}
};

//
const getCourseRows = async (courseLinks, page) => {
	const CSS_SELECTOR = '.row';

	for (let link of courseLinks) {
		console.log(
			`Going to scrape page: ${link.title} at link: ${link.link}`
		);
		await page.goto(`${link.link}`, { waitUntil: 'networkidle2' });
		await page.screenshot({ path: `${link.title}-screenshot.png` });

		const rows = await page.$$(CSS_SELECTOR);
		let sectionTitle = '';
		for (let row of rows) {
			sectionTitle = await page.evaluate(
				el => el.querySelector('.section-title').innerText.trim(),
				row
			);
		}
	}
};

// Main function
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
	createCoursesFoldersAndSnapShot(coursesList, page);

	// go to a course page and get all data for that page.
	await getCourseRows(coursesList, page);
	// shut down the connection
	await browser.close();
};

await scraperMain();
