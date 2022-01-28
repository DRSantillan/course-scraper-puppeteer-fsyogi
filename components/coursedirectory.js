import {
	createFile,
	readFile,
	replaceCharacters,
	saveObject,
} from '../util/utilities.js';

const getCourseDirectoryRows = async page => {
	// css selector to extract rows
	const CSS_SELECTOR = '.row.course-list.list > div > div > div.row';
	// get all divs on the page
	const courseDirectoryRows = await page.$$(CSS_SELECTOR);
	// return array of extracted elements
	return courseDirectoryRows;
};
//
const extractSingleCourseTitleAndUrl = async (directoryCourseRow, page) => {
	// declare variables
	let url,
		title = null;
	// get link to the course page
	url = await page.evaluate(
		el => el.querySelector('a').href,
		directoryCourseRow
	);
	// get title of course
	title = await page.evaluate(
		el => el.querySelector('.course-listing-title').textContent,
		directoryCourseRow
	);

	// return one course title and listing
	return {
		title: replaceCharacters(title),
		url,
	};
};
//
export const getAllDirectoryCourses = async page => {
	//let coursesArray = readFile('courses');
	let allCoursesArray = JSON.parse(readFile('courses'));

	if (allCoursesArray.length === 0) {
		//
		let extractedData = null;
		const courseDirectoryRows = await getCourseDirectoryRows(page);
		//
		for (let courseRow of courseDirectoryRows) {
			extractedData = await extractSingleCourseTitleAndUrl(
				courseRow,
				page
			);
			allCoursesArray.push(extractedData);
		}
		saveObject(allCoursesArray);
	}

	return allCoursesArray;
};
//
