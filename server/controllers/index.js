'use strict'

/**
 * Declares all of our different controllers and exposes them
 * with some sweet names.
 */

module.exports = {
  System: require('./systemCtrl'),
  Course: require('./courseCtrl'),
  Course2: require('./courseCtrl2'),
  Syllabus: require('./courseSyllabusCtrl'),
  noCourse: require('./noCourseCtrl')
}
