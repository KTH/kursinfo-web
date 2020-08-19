import { Component } from "inferno";
import Row from "inferno-bootstrap/dist/Row";
import Col from "inferno-bootstrap/dist/Col";
import i18n from "../../../../i18n";
import { EMPTY } from "../util/constants";

const PILOT_COURSES = [
  "AF1301",
  "HS1001",
  "ME2016",
  "MG1028",
  "MJ2462",
  "ED1110",
  "EH2720",
  "EH2070",
  "SD2900",
  "SD2925",
];

const checkIfPilotCourse = (courseCode) =>
  LISTS_OF_PILOT_COURSES.includes(courseCode);

const PilotNewMemoLink = (courseCode, semester, round) => (
  <a id="memoLink" href={`/kurs-pm/${courseCode}/${semester}/${round}`}>
    {translate.courseLabels.label_course_memo}
  </a>
);

const PdfNoMemoLink = () => (
  <a id="memoLink" className="pdf-link">
    {canGetMemoFiles
      ? translate.courseLabels.no_memo
      : translate.courseLabels.no_memo_connection}
  </a>
);

class CourseFileLinks extends Component {
  render() {
    const translate = i18n.messages[this.props.language];
    const {
      courseCode,
      courseRound,
      scheduleUrl,
      canGetMemoFiles,
      memoStorageURI,
      language,
    } = this.props;
    const isPilot = checkIfPilotCourse(courseCode);

    return (
      <Row id="courseLinks">
        {/* ---LINK TO ROUND PM/MEMO IF ROUND HAS ONE-- */}
        <Col sm="12" xs="12">
          {courseRound.hasOwnProperty("round_memoFile") ? (
            <a
              id="memoLink"
              className="pdf-link"
              href={`${memoStorageURI}${courseRound.round_memoFile.fileName}`}
              target="_blank"
            >
              {translate.courseLabels.label_course_memo} (
              {courseRound.round_memoFile.fileDate})
            </a>
          ) : (
            (isPilot && <PdfNoMemoLink />) || <PdfNoMemoLink />
            // <a id="memoLink" className="pdf-link">
            //   {canGetMemoFiles
            //     ? translate.courseLabels.no_memo
            //     : translate.courseLabels.no_memo_connection}
            // </a>
          )}
        </Col>
        {/* ---LINK TO ROUND SCHEDULE-- */}
        <Col sm="12" xs="12">
          <i className="icon-schedule"></i>
          {scheduleUrl !== EMPTY[language] ? (
            <a target="_blank" href={scheduleUrl}>
              {translate.courseLabels.label_schedule}
            </a>
          ) : (
            <span>{translate.courseLabels.no_schedule}</span>
          )}
        </Col>
      </Row>
    );
  }
}

export default CourseFileLinks;
