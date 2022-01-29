import fs from 'fs';
//
export const createFile = (path, file, content) => {
	createFolder(path);
	if (path && file) {
		fs.writeFileSync(`${path}/${file}`, content, { flag: 'w+' });
		console.log(`Created file: ./${path}/${file}`);
	}
};
//
export const createFolder = (folderPath, folder) => {
	if (!folderPath) return console.log('Please specify a folder path.');

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(`./${folderPath}`);
		console.log(`Created folder: ./${folderPath}`);
	}
	if (folderPath && folder) {
		if (!fs.existsSync(`./${folderPath}/${folder}`)) {
			fs.mkdirSync(`./${folderPath}/${folder}`);
			console.log(`Created folder: ./${folderPath}/${folder}`);
		}
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
		.replaceAll(/\)/gi, '')
		.replaceAll(/\[/gi, '')
		.replaceAll(/\]/gi, '')
		.replaceAll(/w\//gi, '')
		.replaceAll(/\'/gi, 's')
		.replaceAll(/,/gi, '-')
		.replaceAll(/\+/gi, '-')
		.replaceAll(/\//gi, '-')
		.replaceAll('  ', ' ')
		.replaceAll(/&/gi, 'And')
		.replaceAll(/\s+/gi, '-')
		.replaceAll(/--/gi, '-')
		.replaceAll(/,-/gi, '-')
		.replaceAll(/ *\([^)]*\) */g, '')
		.replaceAll(/--/gi, '-')
		.trim();
};

export const saveObject = array => {
	const jsonObject = JSON.stringify(array);
	createFile('data', 'courses.js', jsonObject);
};

export const readFile = fileName => {
	if (fs.existsSync(`./data/${fileName}.js`)) {
		return fs.readFileSync(`./data/${fileName}.js`, 'utf-8');
	} else {
		createFile('data', 'courses.js');
		return fs.readFileSync(`./data/${fileName}.js`, 'utf-8');
	}
};
