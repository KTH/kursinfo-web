import { Component } from 'inferno'

class CourseSection extends Component {
  render() {
    const props = this.props
    return (
      <section className="col-12"> 
        <div >
          {this.props.sectionHeader.length > 0 ? <h2 className={this.props.class}>{this.props.sectionHeader}</h2> : ""} 
          {this.props.courseData.map((data)=>
              <span>
                {this.props.headerType === '4' ? <h4>{data.header}</h4> : <h3>{data.header}</h3> }
                <p dangerouslySetInnerHTML={{ __html:data.text}}/>
               </span>
          )}
        </div>
      </section>  
    )
  }
}

export default CourseSection