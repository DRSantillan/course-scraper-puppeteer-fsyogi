const getDownLoadLink = async page => {
	const videoLink = await page.$eval(videolink => videolink.href);
};
const getPageAttachmentsRows = async page => {
	const attachmentRows = await page.$$('. lecture-text-container');
	return attachmentRows;
};

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

const getAllAttachments = async (page, coursesArray) => {
	const attachmentRows = getPageAttachmentsRows(page);
	const attachmentsArray = [];
	for (let attachmentRow of attachmentRows) {
		let lectureAttachments = getAttachmentTitleAndUrl(row, page);
	}
};
