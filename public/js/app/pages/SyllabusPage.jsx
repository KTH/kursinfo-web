import { render, Component} from 'inferno'
import { inject, observer } from 'inferno-mobx'

import i18n from "../../../../i18n"
import { EMPTY} from "../util/constants"

//Componentsß
import CourseTitle from "../components/CourseTitle.jsx"

@inject(['routerStore']) @observer
class SyllabusPage extends Component {
  constructor (props) {
    super(props)

    }
  /*componentDidMount() {
    window.addEventListener("keydown", (e) => console.log(e))
  }*/

  render ({ routerStore }){
    const courseData = routerStore["courseData"]
    console.log("routerStore in SyllabusePage", courseData)
    return (
      <div  key="syllabus-container" className="syllabus-main-page col" >
        {/* ---COURSE TITEL--- */}
        <CourseTitle key = "title"
            courseTitleData = {courseData.courseTitleData}
            language={courseData.language}
        />

      </div>
    )
  }
}

export default SyllabusPage
