import { replaceCharacters, saveObject } from '../util/utilities.js';
//
const getCourseRows = async page => {
	const CSS_SELECTOR = '.row';
	const courseRows = await page.$$(CSS_SELECTOR);

	return courseRows;
};
//
const extractCourseSectionTitle = async (row, page) => {
	let SectionTitle = '';

	SectionTitle = await page.evaluate(
		SectionTitle =>
			SectionTitle.querySelector('.section-title').innerText.trim(),
		row
	);

	return SectionTitle;
};
//
const getCourseSectionLectureRows = async (row, page) => {
	const CSS_SELECTOR = '.section-list .section-item';
	await page.waitForSelector(CSS_SELECTOR);
	const sectionLectureRows = await row.$$(CSS_SELECTOR);
	return sectionLectureRows;
};
//
const extractCourseSectionLectureTitleAndUrl = async (lectureRow, index) => {
	let url,
		title = '';
	url = await lectureRow.evaluate(
		url => url.querySelector('.section-item .item').href,
		lectureRow
	);
	title = await lectureRow.evaluate(
		title => title.querySelector('.lecture-name').innerText,
		lectureRow
	);

	return {
		title: `${index}-${replaceCharacters(title)}`,
		url,
	};
};
//
const gotoCoursePage = async (url, page, cssSelector) => {
	console.log(
		`#############################################################`
	);
	console.log(`Going to Course URL: ${url}`);
	await page.waitForSelector(cssSelector);
	await page.goto(url, {
		waitUntil: 'networkidle2',
	});
};
//
export const getAllCourseSectionData = async (coursesArray, page) => {
	const courseLectures = [];
	const CSS_SELECTOR = '.row';

	for (let course of coursesArray) {
		await gotoCoursePage(course.url, page, CSS_SELECTOR);
		console.log(`Scraping Page: ${course.title}`);
		const courseRows = await getCourseRows(page);
		console.log(`Html elements recieved........`);
		let sections = [];
		let sectionTitle = '';
		let rowIndex = 1;
		for (let sectionRow of courseRows) {
			let sectionLectures = [];
			sectionTitle = await extractCourseSectionTitle(sectionRow, page);
			console.log(
				`-----------------------------------------------------`
			);
			console.log(`Extract Section Title: ${sectionTitle}`);
			console.log(
				`-----------------------------------------------------`
			);
			const lectureRows = await getCourseSectionLectureRows(
				sectionRow,
				page
			);
			console.log(`Html elements recieved for section lectures........`);
			let lectureRowIndex = 1;
			for (let lectureRow of lectureRows) {
				let lectureData = await extractCourseSectionLectureTitleAndUrl(
					lectureRow,
					lectureRowIndex
				);

				console.log(`Extract lecture Title: ${lectureData.title}`);
				console.log(`Extract lecture Url: ${lectureData.url}`);
				console.log(
					`pushing lectureData to section lectures array........`
				);
				sectionLectures.push(lectureData);
				lectureRowIndex++;
			}
			console.log(
				`pushing section title and section lectures to sections array........`
			);
			sections.push({
				title: `${rowIndex}-${replaceCharacters(sectionTitle)}`,
				lectures: sectionLectures,
			});
			rowIndex++;
		}
		console.log(`pushing course information to courses array........`);
		courseLectures.push({
			title: course.title,
			url: course.url,
			sections,
		});
		console.log(
			`#############################################################`
		);
	}
	saveObject(courseLectures);
	return courseLectures;
};
