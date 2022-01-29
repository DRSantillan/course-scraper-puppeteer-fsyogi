import { saveObject, createFile } from '../util/utilities.js';
import {
	createScreenShot,
	createPDFFile,
	savePDFHTMLPNG,
} from './puppeteer.fsyogi.js';
// extract the url from the html element
const getDownLoadLink = async page => {
	const videoLink = await page.evaluate(() =>
		document
			.querySelector(
				'.lecture-attachment > div.video-options > a.download'
			)
			.getAttribute('href')
	);
	return videoLink;
};
// check to see if the elements exist on the lecture page
const checkIfCssClassExists = async page => {
	const cssExists = await page.evaluate(() => {
		return !!document.querySelector(
			'.lecture-attachment > div.video-options > a.download'
		);
	});
	console.log(`>> Element exist: ${cssExists}................`);
	return cssExists;
};
// get all page attachment rows
const getPageAttachmentsRows = async page => {
	const attachmentRows = await page.$$('. lecture-text-container');
	return attachmentRows;
};
// extract attachment title and url from html elements
const getAttachmentTitleAndUrl = async (row, page) => {
	let link,
		title = '';
	link = await row.evaluate(
		link => link.querySelector('.section-item .item').href,
		row
	);
	title = await row.evaluate(
		title => title.querySelector('.lecture-name').innerText,
		row
	);

	return {
		title: `${index}-${replaceCharacters(title)}`,
		link,
	};
};
// iterate through html element rows and add to attachment database
const getAllAttachments = async (page, coursesArray) => {
	const attachmentRows = getPageAttachmentsRows(page);
	const attachmentsArray = [];
	for (let attachmentRow of attachmentRows) {
		let lectureAttachments = getAttachmentTitleAndUrl(row, page);
	}
};

// navigate to lecture page
const gotoLecturePage = async (url, page) => {
	// const CSS_SELECTOR = '.lecture-attachment > div.video-options > a.download';
	await page.goto(url, {
		waitUntil: 'networkidle2',
	});
	let html = await page.content();
	return html;
};

export const getAllLecturesAndAttachments = async (array, page) => {
	// loop throught all lectures of each section of curriculum
	for (let course of array) {
		for (let section of course.sections) {
			for (let lecture of section.lectures) {
				console.log(`*********************************************`);
				console.log(`>>>> Going to Lecture Page Url: ${lecture.url}`);
				console.log(`>>>> Lecture Page Title: ${lecture.title}`);
				console.log(`*********************************************`);
				// goto each lecture page in section of curriculum
				await gotoLecturePage(lecture.url, page);
				// save content files
				await savePDFHTMLPNG(
					page,
					`courses/${course.title}/${section.title}/${lecture.title}/`,
					`${lecture.title}`
				);
				// check to see if an element is present on the page if so extract data
				if ((await checkIfCssClassExists(page)) === true) {
					// extract video url
					let videoUrl = await getDownLoadLink(page);

					// logging action to console.
					console.log(`****************************************`);
					console.log(`>> Extracted Video Url: ${videoUrl}`);
					console.log(`****************************************`);

					// logging console
					console.log(`>> Adding Video Url to database........`);
					// add videourl to existing lecture
					lecture.videoUrl = videoUrl;
				}
				// continue if required element doestn exist on page
				continue;
			}
		}
	}
	// save lecture data to database.
	saveObject(array);
};
