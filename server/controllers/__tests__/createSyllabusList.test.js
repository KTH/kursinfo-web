const { createSyllabusList } = require('../createSyllabusList')

const expectedSyllabusList = [
  {
    course_goals:
      '<p>After the course the student should be able to</p><ul><li>use concepts. theorems and methods to solve and present solutions to problems within the parts of linear algebra described by the course content,</li><li>read and comprehend mathematical text.</li></ul>',
    course_content:
      "<p>Vectors, matrices, linear equations, Gaussian elimination, vector&#160; geometry with dot product and vector product, determinants, vector spaces, linear independence, bases, change of basis, linear transformations, the least-squares method, eigenvalues, eigenvectors, quadratic forms, orthogonality, inner-product space, Gram-Schmidt's method.</p>",
    course_eligibility: '<p>Basic requirements.&#160;</p><p><strong>&#160;</strong></p>',
    course_requirments_for_final_grade: '<p>Written exam, possibly with the possibility of continuous examination.</p>',
    course_literature: '<i>No information inserted</i>',
    course_literature_comment:
      '<p>Announced no later than 4 weeks before the start of the course on the course web page.</p>',
    course_valid_from: { year: 2019, semesterNumber: 2 },
    course_valid_to: undefined,
    course_required_equipment: '<i>No information inserted</i>',
    course_examination:
      "<ul class='ul-no-padding' ><li>TEN1 - \n                          Examination,\n                          7.5 credits,  \n                          grading scale: AF              \n                          </li></ul>",
    course_examination_comments:
      'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.<p>The examiner decides, in consultation with KTHs Coordinator of students with disabilities (Funka), about any customized examination for students with documented, lasting disability.&#160;</p>',
    course_ethical:
      "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
    course_additional_regulations: '',
    course_transitional_reg: '',
    course_decision_to_discontinue: '<i>No information inserted</i>',
  },
  {
    course_goals:
      '<p>After completing the course students should for a passing grade be able to</p><ul><li>use the basic concepts and problem solving methods in linear&#160;algebra and geometry. In particular it means to be able to:<br />- understand, interpret and use the basic concepts: the vector space&#160;Rn, subspaces of Rn, linear dependence and independence, basis,&#160;dimension, linear transformations, matrix, determinant, eigenvalue and&#160;eigenvector.<br />- solve geometric problems in two and three dimensions using for&#160;example vectors, dot product, vector product, triple product and&#160;projection.<br />- use Gauss-Jordan?s method for example to solve linear systems of&#160;equations, calculate inverse matrices, determinants and to resolve&#160;questions about linearly independent.<br />- use matrix and determinant calculus to address issues regarding&#160;linear transformations and linear systems.<br />- use the least-squares method to solve for example problems with&#160;over-determined linear systems of equations.<br />- use different bases for vector spaces to handle vectors and linear&#160;transformations, and to manage changes of bases and linear coordinate&#160;transformations.<br />- compute eigenvalues and eigenvectors and use this for example in&#160;order to diagonalize matrices, to study quadratic forms, conics in the&#160;plane and quadratic surfaces in three space.<br />- use the Euclidean inner product in order to address the questions&#160;<br />about distance, orthogonality and projection, and apply Gram-Schmidt?s&#160;<br />method to calculate orthogonal bases of subspaces.</li><li>set up simple mathematical models where the fundamental concepts&#160;in linear algebra and geometry are used, discuss the relevance of such&#160;<br />models, reasonableness and accuracy, and know how mathematical&#160; software can be used for calculations and visualization.</li><li>read and understand mathematical texts about for example,&#160; vectors, matrices, linear transformations and their applications,&#160;communicate mathematical reasoning and calculations in this area,&#160;orally and in writing in such a way that they are easy to follow.</li></ul><p>For higher grades, the student in addition should be able to:</p><ul><li>manage general vector spaces, such as function spaces or vector&#160;spaces of matrices. </li><li>use other inner products than the Euclidean inner product.</li><li>derive important relations in linear algebra and geometry.</li><li>generalize and adapt the methods to use in somewhat new contexts.</li><li>solve problems that require synthesis of material and ideas from&#160;all over the course.</li><li>describe the theory behind concepts such as eigenvalues and&#160;orthogonality.</li></ul>',
    course_content:
      '<p>Vectors, matrices, linear equations, Gaussian elimination, vector&#160; geometry with dot product and vector product, determinants, vector&#160;spaces, linear independence, bases, change of basis, the least-squares&#160;method, eigenvalues, eigenvectors, quadratic forms, orthogonality,&#160;inner-product space, Gram-Schmidt?s method</p>',
    course_eligibility:
      '<p>Basic and specific requirements for engineering program.<br /><strong>Mandatory for first year, can not be read by other students</strong></p>',
    course_requirments_for_final_grade: '<p>Written exam, possibly with the possibility of continuous examination.</p>',
    course_literature: '<i>No information inserted</i>',
    course_literature_comment: '<i>No information inserted</i>',
    course_valid_from: { year: 2010, semesterNumber: 2 },
    course_valid_to: { year: 2019, semesterNumber: 1 },
    course_required_equipment: '<i>No information inserted</i>',
    course_examination:
      "<ul class='ul-no-padding' ><li>TEN1 - \n                          Examination,\n                          7.5 credits,  \n                          grading scale: AF              \n                          </li></ul>",
    course_examination_comments:
      'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
    course_ethical:
      "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
    course_additional_regulations: '',
    course_transitional_reg: '',
    course_decision_to_discontinue: '<i>No information inserted</i>',
  },
  {
    course_goals: '<i>No information inserted</i>',
    course_content: '<i>No information inserted</i>',
    course_eligibility: '<i>No information inserted</i>',
    course_requirments_for_final_grade: '',
    course_literature: '<i>No information inserted</i>',
    course_literature_comment: '<i>No information inserted</i>',
    course_valid_from: { year: 2009, semesterNumber: 2 },
    course_valid_to: { year: 2010, semesterNumber: 1 },
    course_required_equipment: '<i>No information inserted</i>',
    course_examination:
      "<ul class='ul-no-padding' ><li>TEN1 - \n                          Examination,\n                          7.5 credits,  \n                          grading scale: AF              \n                          </li></ul>",
    course_examination_comments:
      'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
    course_ethical:
      "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
    course_additional_regulations: '',
    course_transitional_reg: '',
    course_decision_to_discontinue: '<i>No information inserted</i>',
  },
  {
    course_goals: '<i>No information inserted</i>',
    course_content: '<i>No information inserted</i>',
    course_eligibility: '<i>No information inserted</i>',
    course_requirments_for_final_grade: '',
    course_literature: '<i>No information inserted</i>',
    course_literature_comment: '<i>No information inserted</i>',
    course_valid_from: { year: 2008, semesterNumber: 2 },
    course_valid_to: { year: 2009, semesterNumber: 1 },
    course_required_equipment: '<i>No information inserted</i>',
    course_examination:
      "<ul class='ul-no-padding' ><li>TEN1 - \n                          Examination,\n                          7.5 credits,  \n                          grading scale: AF              \n                          </li></ul>",
    course_examination_comments:
      'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
    course_ethical:
      "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
    course_additional_regulations: '',
    course_transitional_reg: '',
    course_decision_to_discontinue: '<i>No information inserted</i>',
  },
]

const syllabuses = [
  {
    edition: 1,
    validFromTerm: {
      term: 20192,
    },
    inStateApproved: true,
    courseSyllabus: {
      discontinuationText:
        'If the course is discontinued, students may request to be examined during the following two academic years',
      goals:
        '<p>After the course the student should be able to</p><ul><li>use concepts. theorems and methods to solve and present solutions to problems within the parts of linear algebra described by the course content,</li><li>read and comprehend mathematical text.</li></ul>',
      content:
        "<p>Vectors, matrices, linear equations, Gaussian elimination, vector&#160; geometry with dot product and vector product, determinants, vector spaces, linear independence, bases, change of basis, linear transformations, the least-squares method, eigenvalues, eigenvectors, quadratic forms, orthogonality, inner-product space, Gram-Schmidt's method.</p>",
      eligibility: '<p>Basic requirements.&#160;</p><p><strong>&#160;</strong></p>',
      literatureComment:
        '<p>Announced no later than 4 weeks before the start of the course on the course web page.</p>',
      examComments:
        'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.<p>The examiner decides, in consultation with KTHs Coordinator of students with disabilities (Funka), about any customized examination for students with documented, lasting disability.&#160;</p>',
      reqsForFinalGrade: '<p>Written exam, possibly with the possibility of continuous examination.</p>',
      establishment: 'Course syllabus for SF1624 valid from Autumn 2019',
      languageOfInstruction:
        'The language of instruction is specified in the course offering information in the course catalogue.',
      ethicalApproach:
        "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
      courseSyllabusVersionValidFromTerm: {
        term: 20192,
      },
    },
  },
  {
    edition: 2,
    validFromTerm: {
      term: 20102,
    },
    inStateApproved: true,
    courseSyllabus: {
      discontinuationText:
        'If the course is discontinued, students may request to be examined during the following two academic years',
      goals:
        '<p>After completing the course students should for a passing grade be able to</p><ul><li>use the basic concepts and problem solving methods in linear&#160;algebra and geometry. In particular it means to be able to:<br />- understand, interpret and use the basic concepts: the vector space&#160;Rn, subspaces of Rn, linear dependence and independence, basis,&#160;dimension, linear transformations, matrix, determinant, eigenvalue and&#160;eigenvector.<br />- solve geometric problems in two and three dimensions using for&#160;example vectors, dot product, vector product, triple product and&#160;projection.<br />- use Gauss-Jordan?s method for example to solve linear systems of&#160;equations, calculate inverse matrices, determinants and to resolve&#160;questions about linearly independent.<br />- use matrix and determinant calculus to address issues regarding&#160;linear transformations and linear systems.<br />- use the least-squares method to solve for example problems with&#160;over-determined linear systems of equations.<br />- use different bases for vector spaces to handle vectors and linear&#160;transformations, and to manage changes of bases and linear coordinate&#160;transformations.<br />- compute eigenvalues and eigenvectors and use this for example in&#160;order to diagonalize matrices, to study quadratic forms, conics in the&#160;plane and quadratic surfaces in three space.<br />- use the Euclidean inner product in order to address the questions&#160;<br />about distance, orthogonality and projection, and apply Gram-Schmidt?s&#160;<br />method to calculate orthogonal bases of subspaces.</li><li>set up simple mathematical models where the fundamental concepts&#160;in linear algebra and geometry are used, discuss the relevance of such&#160;<br />models, reasonableness and accuracy, and know how mathematical&#160; software can be used for calculations and visualization.</li><li>read and understand mathematical texts about for example,&#160; vectors, matrices, linear transformations and their applications,&#160;communicate mathematical reasoning and calculations in this area,&#160;orally and in writing in such a way that they are easy to follow.</li></ul><p>For higher grades, the student in addition should be able to:</p><ul><li>manage general vector spaces, such as function spaces or vector&#160;spaces of matrices. </li><li>use other inner products than the Euclidean inner product.</li><li>derive important relations in linear algebra and geometry.</li><li>generalize and adapt the methods to use in somewhat new contexts.</li><li>solve problems that require synthesis of material and ideas from&#160;all over the course.</li><li>describe the theory behind concepts such as eigenvalues and&#160;orthogonality.</li></ul>',
      content:
        '<p>Vectors, matrices, linear equations, Gaussian elimination, vector&#160; geometry with dot product and vector product, determinants, vector&#160;spaces, linear independence, bases, change of basis, the least-squares&#160;method, eigenvalues, eigenvectors, quadratic forms, orthogonality,&#160;inner-product space, Gram-Schmidt?s method</p>',
      eligibility:
        '<p>Basic and specific requirements for engineering program.<br /><strong>Mandatory for first year, can not be read by other students</strong></p>',
      examComments:
        'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
      reqsForFinalGrade: '<p>Written exam, possibly with the possibility of continuous examination.</p>',
      establishment: 'Course syllabus for SF1624 valid from Autumn 2010',
      languageOfInstruction:
        'The language of instruction is specified in the course offering information in the course catalogue.',
      ethicalApproach:
        "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
      courseSyllabusVersionValidFromTerm: {
        term: 20102,
      },
    },
  },
  {
    edition: 1,
    validFromTerm: {
      term: 20092,
    },
    inStateApproved: true,
    courseSyllabus: {
      discontinuationText:
        'If the course is discontinued, students may request to be examined during the following two academic years',
      examComments:
        'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
      establishment: 'Course syllabus for SF1624 valid from Autumn 2009',
      languageOfInstruction:
        'The language of instruction is specified in the course offering information in the course catalogue.',
      ethicalApproach:
        "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
      courseSyllabusVersionValidFromTerm: {
        term: 20092,
      },
    },
  },
  {
    edition: 1,
    validFromTerm: {
      term: 20082,
    },
    inStateApproved: true,
    courseSyllabus: {
      discontinuationText:
        'If the course is discontinued, students may request to be examined during the following two academic years',
      examComments:
        'Based on recommendation from KTH’s coordinator for disabilities, the examiner will decide how to adapt an examination for students with documented disability. <br><br>The examiner may apply another examination format when re-examining individual students.',
      establishment: 'Course syllabus for SF1624 valid from Autumn 2008',
      languageOfInstruction:
        'The language of instruction is specified in the course offering information in the course catalogue.',
      ethicalApproach:
        "<ul><li>All members of a group are responsible for the group's work.</li><li>In any assessment, every student shall honestly disclose any help received and sources used.</li><li>In an oral assessment, every student shall be able to present and answer questions about the entire assignment and solution.</li></ul>",
      courseSyllabusVersionValidFromTerm: {
        term: 20082,
      },
    },
  },
]

const course = {
  academicLevel: 'A',
  courseCode: 'SF1624',
  versionNumber: 1,
  departmentCode: 'SF',
  department: {
    code: 'SF',
    name: 'SCI/Mathematics',
  },
  educationalLevelCode: 'BASIC',
  educationalTypeId: 22,
  gradeScaleCode: 'AF',
  title: 'Algebra and Geometry',
  titleOther: 'Algebra och geometri',
  cancelled: false,
  deactivated: false,
  credits: 7.5,
  creditUnitLabel: 'Credits',
  creditUnitAbbr: 'hp',
  state: 'ESTABLISHED',
  courseVersion: {
    versionNumber: 1,
    keywordsEn: [],
    keywordsSv: [],
  },
}

const examinationModulesEn = [
  {
    ladokUID: '7f20dbb6-73d8-11e8-b4e0-063f9afb40e3',
    kod: 'TEN1',
    benamning: 'Examination',
    betygsskala: {
      id: '131657',
      code: 'AF',
      name: 'Seven point grading scale',
      nameOther: 'Sjugradig betygsskala',
    },
    omfattning: {
      number: '7.5',
      formattedWithUnit: '7.5 credits',
    },
    giltigFrom: {
      id: '133040',
      code: 'HT2007',
      sv: 'Hösttermin 2007',
      en: 'Autumn semester 2007',
    },
  },
]

describe('createSyllabusList', () => {
  test('creates syllabus list', () => {
    const { syllabusList } = createSyllabusList(
      { publicSyllabusVersions: syllabuses, course },
      examinationModulesEn,
      'en'
    )

    expect(syllabusList).toEqual(expectedSyllabusList)
  })

  test('if empty publicSyllabusVersions, returns empty array', () => {
    const { syllabusList } = createSyllabusList({ publicSyllabusVersions: [], course }, examinationModulesEn, 'en')

    expect(syllabusList).toEqual([])
  })
})
