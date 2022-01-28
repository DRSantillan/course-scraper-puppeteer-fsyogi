import dotenv from 'dotenv';

import {
	createScreenShot,
	initializePuppeteer,
	loginToSite,
} from './components/puppeteer.fsyogi.js';
import { getAllDirectoryCourses } from './components/coursedirectory.js';
import { getAllCourseSectionData } from './components/coursecurriculum.js';
import { createFile } from './util/utilities.js';

dotenv.config();

const app = async () => {
	// setup an execution context for puppeteer
	const init = await initializePuppeteer();
	// Login to site
	await loginToSite(init.page);
	// take a snapshot of the course page
	await createScreenShot(init.page, 'courses');
	// get the page content and save to the main directory
	await createFile('courses', 'index.html', await init.page.content());
	// get a list of all courses from directory page
	const directoryCourseList = await getAllDirectoryCourses(init.page);
	// get all lectures by section
	const coursesAndLecturesList = await getAllCourseSectionData(
		directoryCourseList,
		init.page
	);

	//
	// const getLecturesList = await getAllLecturesAndAttachments(
	// 	coursesAndLecturesList,
	// 	page
	// );

	// shut down the connection
	await init.browser.close();
};

await app();
