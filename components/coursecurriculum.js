import {
	replaceCharacters,
	saveObject,
	createFile,
} from '../util/utilities.js';
import {
	createScreenShot,
	createPDFFile,
	savePDFHTMLPNG,
} from './puppeteer.fsyogi.js';
// get all course row elements
const getCourseRows = async page => {
	const CSS_SELECTOR = '.row';
	const courseRows = await page.$$(CSS_SELECTOR);
	return courseRows;
};
// get course title
const extractCourseSectionTitle = async (row, page) => {
	let SectionTitle = '';
	// extract title from element
	SectionTitle = await page.evaluate(
		SectionTitle =>
			SectionTitle.querySelector('.section-title').innerText.trim(),
		row
	);
	//
	return SectionTitle;
};
// get row elements for extraction
const getCourseSectionLectureRows = async (row, page) => {
	const CSS_SELECTOR = '.section-list .section-item';
	await page.waitForSelector(CSS_SELECTOR);
	const sectionLectureRows = await row.$$(CSS_SELECTOR);
	return sectionLectureRows;
};
// extract section title and url from elements
const extractCourseSectionLectureTitleAndUrl = async (lectureRow, index) => {
	let url,
		title = '';
	// get url
	url = await lectureRow.evaluate(
		url => url.querySelector('.section-item .item').href,
		lectureRow
	);
	// get title
	title = await lectureRow.evaluate(
		title => title.querySelector('.lecture-name').innerText,
		lectureRow
	);
	// return section object
	return {
		title: `${index}-${replaceCharacters(title)}`,
		url,
	};
};
// goto course page for extraction process
const gotoCoursePage = async (url, page) => {
	const CSS_SELECTOR = '.row';
	// wait for css selector to load
	await page.waitForSelector(CSS_SELECTOR);
	// navigate to required url
	await page.goto(url, {
		waitUntil: 'networkidle2',
	});
};
//
export const getAllCourseSectionData = async (coursesArray, page) => {
	const allCoursesArray = [];

	for (let course of coursesArray) {
		// navigate to single course page
		console.log(`############################################`);
		console.log(`>>>> Going to Course Page Url: ${course.url}`);
		console.log(`>>>> Course Page Title: ${course.title}`);
		console.log(`############################################`);
		// navigate to course page
		await gotoCoursePage(course.url, page);
		// logging console
		console.log(`>> Saving Html file................`);
		// create file for page
		createFile(
			`courses/${course.title}`,
			'index.html',
			await page.content()
		);
		// logging console
		console.log(`>> Taking a Screenshot................`);
		// take a snapshot of page
		await createScreenShot(page, `courses/${course.title}`, course.title);
		// logging console
		console.log(`>> Creating a PDF File................`);
		//create pdf file
		await createPDFFile(page, `courses/${course.title}`, course.title);
		// logging console
		console.log(`Scraping Page: ${course.title}`);
		// get all course row elements
		const courseRows = await getCourseRows(page);
		// declare required vars to work with
		let sections = [];
		let sectionTitle = '';
		let rowIndex = 1;
		// looping through all course sections
		for (let sectionRow of courseRows) {
			// declare vars for working with course sections
			let sectionLectures = [];
			let lectureRowIndex = 1;
			// extract the title of each section
			sectionTitle = await extractCourseSectionTitle(sectionRow, page);
			// logging to console.
			console.log(`<><><><><><><><><><><><><><><><><><><><><><>`);
			console.log(`>>>> Extracted Section Title: ${sectionTitle}`);
			console.log(`<><><><><><><><><><><><><><><><><><><><><><>`);
			// save content
			await savePDFHTMLPNG(
				page,
				`courses/${course.title}/${rowIndex}-${replaceCharacters(
					sectionTitle
				)}`,
				`${replaceCharacters(sectionTitle)}`
			);

			// extract lectures row elements for manipulation
			const lectureRows = await getCourseSectionLectureRows(
				sectionRow,
				page
			);
			// loop through lecture rows to extract lecturs
			for (let lectureRow of lectureRows) {
				// extract title and url from row data
				let lectureData = await extractCourseSectionLectureTitleAndUrl(
					lectureRow,
					lectureRowIndex
				);
				// logging actions to console
				console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
				console.log(`>> Extracted Lecture Title: ${lectureData.title}`);
				console.log(`>> Extract lecture Url: ${lectureData.url}`);
				console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
				console.log(`>> Adding Lecture to Lectures................`);
				sectionLectures.push(lectureData);
				lectureRowIndex++;
			}
			// logging actions to console
			console.log(`>> Adding all Lectures to Sections...............`);
			sections.push({
				title: `${rowIndex}-${replaceCharacters(sectionTitle)}`,
				lectures: sectionLectures,
			});
			rowIndex++;
		}
		// logging actions to console
		console.log(`>> Adding all Curriculum to Courses...................`);
		// push curriculum to the specified course
		allCoursesArray.push({
			title: course.title,
			url: course.url,
			sections,
		});

		console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
		console.log(`>> Completed Lecture Extraction...................`);
		console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
		
	// Save database to disk.
	saveObject(allCoursesArray);
	// return database for further manipulation.
	return allCoursesArray;
};
