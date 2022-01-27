import fs from 'fs';
//
export const createFile = (path, file, content) => {
	fs.writeFile(`${path}/${file}`, content, { flag: 'w+' }, err => {
		if (err) {
			console.error(err);
			return;
		} else {
			console.log(`Created file: ./${path}/${file}`);
		}
	});
};
//
export const createFolder = (folderPath, folder) => {
	if (!folderPath) return console.log('Please specify a folder path.');

	if (!fs.existsSync(folderPath)) {
		fs.mkdir(`./${folderName}`);
		console.log(`Created folder: ./${folderName}`);
	}

	if (!fs.existsSync(`./${folderPath}/${folder}`)) {
		fs.mkdir(`./${folderPath}/${folder}`);
		console.log(`Created folder: ./${folderPath}/${folder}`);
	}
};
//
export const replaceCharacters = textToManipulate => {
	return textToManipulate
		.trim()
		.replaceAll(': Zero to Mastery', '')
		.replaceAll('  ', ' ')
		.replaceAll(/:/gi, '-')
		.replaceAll(/\(/gi, '')
		.replaceAll(/)/gi, '')
		.replaceAll(/\[/gi, '')
		.replaceAll(/]/gi, '')
		.replaceAll(/w\//gi, '')
		.replaceAll(/\'/gi, 's')
		.replaceAll(/,/gi, '-')
		.replaceAll(/+/gi, '-')
		.replaceAll(/--/gi, '-')
		.replaceAll(/\//gi, '-')
		.replaceAll('  ', ' ')
		.replaceAll(/&/gi, 'And')
		.replaceAll(/\s+/gi, '-')
		.replaceAll(/--/gi, '-')
		.replaceAll(/,-/gi, '-')
		.replaceAll(/ *\([^)]*\) */g, '')
		.trim();
};
