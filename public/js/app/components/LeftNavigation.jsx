import { ADMIN_URL, COURSE_HISTORY_URL } from '../util/constants'

const LeftNavigation = ({courseCode, translate, lang}) => { // courseCode, lang, startCards
  const courseHistoryLink = `${COURSE_HISTORY_URL}${courseCode}?l=${lang}`
  const kursAdmin = `${ADMIN_URL}${courseCode}?l=${lang}`
  return (
    <div className='col-md-12' id='leftNavigation'>
        <div className='navigation col-md-6 col-sm-12'>
            <div className='row  kip-menu'>
                <div className='col-md-7 admin-block'>
                    <h4>{translate.about_course}</h4>
                    <p>
                        <b>{translate.course_page}</b>
                    </p>
                    <p>
                        <a href={courseHistoryLink}>{translate.course_history}</a>
                    </p>

                </div>
                <div className='col-md-5 admin-link admin-block'>
                    <p>
                        <a href={kursAdmin} className='link-to'>{translate.label_edit}</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default LeftNavigation
