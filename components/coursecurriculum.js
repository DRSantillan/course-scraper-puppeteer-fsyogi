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
const getCourseSectionLectureRows = async row => {
	const sectionLectureRows = await row.$$('.section-list .section-item');
	return sectionLectureRows;
};
//
const extractCourseSectionLectureTitleAndUrl = async (lectureRow, index) => {
	let link,
		title = '';
	link = await lectureRow.evaluate(
		link => link.querySelector('.section-item .item').href,
		lectureRow
	);
	title = await lectureRow.evaluate(
		title => title.querySelector('.lecture-name').innerText,
		lectureRow
	);

	return {
		title: `${index}-${replaceCharacters(title)}`,
		link,
	};
};
//
const gotoCoursePage = async (url, page, cssSelector) => {
	console.log(`Going to Course URL: ${url}`);
	await page.waitForSelector(cssSelector);
	await page.goto(`${url}`, {
		waitUntil: 'networkidle2',
	});
};
//
const getAllCourseSectionData = async (coursesArray, page, cssSelector) => {
	const courseLectures = [];

	for (let course of coursesArray) {
		await gotoCoursePage(course.url, page, cssSelector);
		const Rows = await getCourseRows(page);
		let sections = [];
		let SectionTitle = '';
		let rowIndex = 1;
		for (let sectionRow of Rows) {
			let SectionLectures = [];
			SectionTitle = await extractCourseSectionTitle(sectionRow, page);

			const lectureRows = await getCourseSectionLectureRows(sectionRow);
			let lectureRowIndex = 1;
			for (let lectureRow of lectureRows) {
				SectionLectures.push(
					extractCourseSectionLectureTitleAndUrl(
						lectureRow,
						lectureRowIndex
					)
				);
				lectureRowIndex++;
			}
			sections.push({
				title: `${rowIndex}-${replaceCharacters(sectionTitle)}`,
				lectures: sectionLectures,
			});
			rowIndex++;
		}
		courseLectures.push({
			title: course.title,
			url: course.link,
			sections,
		});
	}
	return courseLectures;
};
