'use strict'

import { render, Component } from 'inferno'

class CoursePage extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const lang = 'sv' // TODO: Pick up from actual language settings

    return (
        <div className="kth-show-course-info">
          Hello KTH student
        </div>
    )
  }
}

export default CoursePage