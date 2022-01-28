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
        Title: 'Title',
        Url: 'Url',
        curriculum: 
        [
            {
				sectionTitle: 'Title',
				Lectures: 
                [
                    {
                        Title: 'Title',
                        link: 'Url',
                        videoUrl: 'videoUrl',
                        attachments: [
                            {
                            title: 'Title',
                            link: 'link'
                            }
                        ]
	                }
                ],
			}
        ]
	}




        


