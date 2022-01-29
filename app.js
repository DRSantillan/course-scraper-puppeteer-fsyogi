import dotenv from 'dotenv';

import {
	createScreenShot,
	initializePuppeteer,
	loginToSite,
	createPDFFile,
} from './components/puppeteer.fsyogi.js';
import { getAllDirectoryCourses } from './components/coursedirectory.js';
import { getAllCourseSectionData } from './components/coursecurriculum.js';
import { getAllLecturesAndAttachments } from './components/coursepage.js';
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
	//create pdf file
	await createPDFFile(init.page, `courses`);
	// get a list of all courses from directory page
	const directoryCourseList = await getAllDirectoryCourses(init.page);
	// get all lectures by section
	const coursesAndLecturesList = await getAllCourseSectionData(
		directoryCourseList,
		init.page
	);
	// get all lectures from courses
	const getLecturesList = await getAllLecturesAndAttachments(
		coursesAndLecturesList,
		init.page
	);

	// shut down the connection
	await init.browser.close();
};

await app();
