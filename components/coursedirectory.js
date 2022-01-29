import { replaceCharacters, saveObject } from '../util/utilities.js';

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
// get all course from main directory page
export const getAllDirectoryCourses = async page => {
	let allCoursesArray = [];

	// only process if course array is empty
	// this is for reading from the db but havent implemented yet
	if (allCoursesArray.length === 0) {
		//
		let extractedData = null;

		// get all course rows to manipulate
		const courseDirectoryRows = await getCourseDirectoryRows(page);
		// loop through course rows
		for (let i = 10; i < 11; i++) {
			// extract course information
			extractedData = await extractSingleCourseTitleAndUrl(
				courseDirectoryRows[i],
				page
			);
			// add extracted data to main database
			allCoursesArray.push(extractedData);
		}
		// for (let courseRow of courseDirectoryRows) {
		// 	extractedData = await extractSingleCourseTitleAndUrl(
		// 		courseRow,
		// 		page
		// 	);
		// 	allCoursesArray.push(extractedData);
		// }
	}

	// allCoursesArray.shift();
	// allCoursesArray.shift();
	// allCoursesArray.pop();
	// allCoursesArray.pop();

	// save all database to disk
	saveObject(allCoursesArray);
	// return for retrieving sections and lectures.
	return allCoursesArray;
};
//
