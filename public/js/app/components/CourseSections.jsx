import { Component } from 'inferno'
import Button from 'inferno-bootstrap/dist/Button'

class CourseSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: props.isOpen,
      class: 'collapseBtn',
      iconClass: props.isOpen ? "icon-chevron-down":"icon-chevron-right"
    }
    //this.doToggle = this.doToggle.bind(this)
  }

  /*doToggle(e) {
    e.preventDefault()
    this.setState({
      isOpen: !this.state.isOpen,
      iconClass: !this.state.isOpen ? "icon-chevron-down":"icon-chevron-right"
    })
  }*/

  render() {
    return (
      <section> 
        <div className="col">
              {this.props.courseData.map((data)=>
              <span>
                 <h3>{data.header}</h3> 
                <p dangerouslySetInnerHTML={{ __html:data.text}}/>
               </span>
              )}
        </div>
      </section>  
    )
  }
}

export default CourseSection