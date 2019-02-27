import { Component } from 'inferno'

class CourseSection extends Component {
  render() {
    const props = this.props
    return (
      <section className="col-12" id={props.sectionId}> 
        <div >
          {props.sectionHeader.length > 0 ? <h2 className={props.class}>{props.sectionHeader}</h2> : ""} 
          {props.courseData.map((data, index)=>
              <span>
                {props.headerType === '4' ? <h4>{data.header}</h4> : <h3>{data.header}</h3> }
                <p dangerouslySetInnerHTML={{ __html:data.text}}/>
               </span>
          )}
        </div>
      </section>  
    )
  }
}

export default CourseSection