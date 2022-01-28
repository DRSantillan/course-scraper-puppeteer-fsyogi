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
	allCourses.shift();
	allCourses.shift();
	allCourses.pop();
	allCourses.pop();
	//
	return allCourses;
};

// loop through return courses and create folder and an image snapshot for each course
const createCoursesFoldersAndSnapShot = async (coursesArray, page) => {
	const mainFolder = 'courses';

	for (let course of coursesArray) {
		createFolder(mainFolder, course.title);
	}
};

//
const getCourseRows = async (courses, page) => {
	const CSS_SELECTOR = '.row';
	const courseLectures = [];

	for (let course of courses) {
		console.log(`Going to link: ${course.link}`);
		console.log(`Scraping Page: ${course.title}`);
		await page.waitForSelector(CSS_SELECTOR);
		await page.goto(`${course.link}`, {
			waitUntil: 'networkidle2',
		});

		//
		createFile(
			`courses/${course.title}`,
			'index.html',
			await page.content()
		);
		await page.screenshot({
			path: `./courses/${course.title}/screenshot.png`,
			fullPage: true,
		});

		const rows = await page.$$(CSS_SELECTOR);
		let sections = [];
		let rowIndex = 1;
		let sectionTitle = '';
		for (let row of rows) {
			let sectionLectures = [];
			sectionTitle = await getPageSectionData(row, page);
			
			createFolder(
				`courses/${course.title}`,
				`${rowIndex}-${replaceCharacters(sectionTitle)}`
			);
			const sectionRowList = await row.$$('.section-list .section-item');
			let lectureIndex = 1;
			for (const section of sectionRowList) {
				sectionLectures.push(
					getPageSectionLecturesData(section, lectureIndex)
				);
				// need to add createfolder for lectures
				lectureIndex++;
			}
			sections.push({
				title: `${rowIndex}-${replaceCharacters(sectionTitle)}`,
				lectures: sectionLectures,
			});
			rowIndex++;
		}
		courseLectures.push({
			courseTitle: course.title,
			courseUrl: course.link,
			sections,
		});
	}
	return courseLectures;
};

const getPageSectionData = async (row, page) => {
	let sectionTitle = '';

	sectionTitle = await page.evaluate(
		el => el.querySelector('.section-title').innerText.trim(),
		row
	);

	return sectionTitle;
};

const getPageSectionLecturesData = async (row, index) => {
	let lectureLink,
		lectureTitle = '';
	lectureLink = await row.evaluate(
		el => el.querySelector('.section-item .item').href,
		row
	);
	lectureTitle = await row.evaluate(
		el => el.querySelector('.lecture-name').innerText,
		row
	);

	return {
		title: `${index}-${replaceCharacters(lectureTitle)}`,
		pagelink: lectureLink,
	};
};

// Main function
const scraperMain = async () => {
	// setup an execution context for puppeteer
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(15000);

	// Login to site
	await loginToSite(page);

	// take a snapshot of the course page
	await createSnapShot(page, 'courses');

	// get the page content and save to the main directory
	await createFile('courses', 'index.html', await page.content());

	// Get all the courses on the main course page
	const coursesList = await getAllCourses(page);
	//createCoursesFoldersAndSnapShot(coursesList, page);

	// go to a course page and get all data for that page.
	const courseListwithLectures = await getCourseRows(coursesList, page);
	console.log(courseListwithLectures);
	// shut down the connection
	await browser.close();
};

await scraperMain();
