# Course Directory
``` javascript
const getCourseDirectoryRows = async () => {} 
const extractSingleCourseTitleAndUrl = async () => {}
const getAllDirectoryCourses = async (rows, page) => {}
const gotoCourseCurriculumPage = async url => {}
```
## Course Curriculum
``` javascript
    const getCourseCurriculumRows = async () => {}
    const extractCourseCurriculumSectionTitle = async () => {}
    const getCourseCurriculumSectionLectureRows = async () => {}
    const extractCourseCurriculimSectionLectureTitleAndUrl = async () => {}
    const getAllCourseCurriculumSectionData = async (coursesArray, page ) => {}
```
### Lecture

```javascript 
    const getDownLoadLink = async () => {}
    const getPageAttachments = async () => {} 
```
#### Utilites
```javascript
    const saveLecturePage = () => {}
    const downloadVideo = async () => {}
    const createPDFfile = async () => {}
    const saveDataToStorage = () => {}
```

```javascript object
    {
        courseTitle: 'JavaScript: The Advanced Concepts',
        courseUrl: 'https://academy.zerotomastery.io/courses/enrolled/698487',
        curriculum: 
        [
            {
				sectionTitle: 'Introduction',
				sectionLectures: 
                [
                    {
                        Title: 'Javascript Engine',
                        Url: 'https://academy.zerotomastery.io/courses/698487/lectures/12538207',
                        videoUrl: 'https://cdn.fs.teachablecdn.com/XVyCMWvzQAyVFsg4fvbt',
                        attachments: [{
                            title: 'ECMAScript Engines',
                            link: 'https://en.wikipedia.org/wiki/List_of_ECMAScript_engines'
                        },{
                            title: 'ECMAScript Engines',
                            link: 'https://en.wikipedia.org/wiki/List_of_ECMAScript_engines'
                        }
                        ]
	                }
                ],
			},{
				sectionTitle: 'JavaScript Foundation',
				sectionLectures: 
                [
                    {
                        Title: 'Javascript Engine',
                        Url: 'https://academy.zerotomastery.io/courses/698487/lectures/12538207',
                        videoUrl: 'https://cdn.fs.teachablecdn.com/XVyCMWvzQAyVFsg4fvbt',
                        attachments: [{
                            title: 'ECMAScript Engines',
                            link: 'https://en.wikipedia.org/wiki/List_of_ECMAScript_engines'
                        },{
                            title: 'ECMAScript Engines',
                            link: 'https://en.wikipedia.org/wiki/List_of_ECMAScript_engines'
                        }
                        ]
	                }
                ],
			}
        ]
	}




        


