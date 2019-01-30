import { Component } from 'inferno'
import Button from 'inferno-bootstrap/dist/Button'

class CourseSection extends Component {
  render() {
    return (
      <section className="col-12"> 
        <div >
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