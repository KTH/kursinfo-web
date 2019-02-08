import Dropdown from 'inferno-bootstrap/dist/Dropdown'
import DropdownMenu from 'inferno-bootstrap/dist/DropdownMenu'
import DropdownItem from 'inferno-bootstrap/dist/DropdownItem'
import DropdownToggle from 'inferno-bootstrap/dist/DropdownToggle'

import i18n from "../../../../i18n"
import { EMPTY } from "../util/constants"

const DropdownCreater = ({ courseRoundList , callerInstance, semester, year = "2018", yearSemester, language =0, parentIndex = 0}) => {
    let listIndex = []
    const dropdownID = "roundDropdown"+parentIndex
    return(
      <div className = "col-3 round-dropdowns">
        <Dropdown  group isOpen={callerInstance.state.dropdownsIsOpen[dropdownID]} toggle={callerInstance.toggle} key={"dropD"+parentIndex} >
                  <DropdownToggle className={callerInstance.state.activeDropdown===dropdownID ? "is-active dropdown-clean": "dropdown-clean"} id={dropdownID} caret >
                    {i18n.messages[language].courseInformation.course_short_semester[semester]} {year}
                  </DropdownToggle>
                  <DropdownMenu>
                  {
                    courseRoundList.filter( (courseRound, index) =>{
                      if(courseRound.round_course_term.join('') === yearSemester){
                        listIndex.push(index)
                        return courseRound
                      }
                    }).map( (courseRound, index) =>{
                    return (
                        <DropdownItem key ={index} id={dropdownID+"_"+listIndex[index]+"_"+parentIndex} onClick = {callerInstance.handleDropdownSelect}> 
                          {
                            ` 
                            ${courseRound.round_short_name !== EMPTY ? courseRound.round_short_name : "" },     
                            ${courseRound.round_type}`
                          } 
                        </DropdownItem>
                    )
                  })}
              </DropdownMenu>
            </Dropdown>
        </div>
    )
  }

  export default DropdownCreater