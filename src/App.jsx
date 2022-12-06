import React, {useState,useEffect} from 'react';
import './App.css';
import {Card, CardHeader,CardContent} from "@mui/material"
import axios from 'axios'

const App = () => {

  const [studentData, setStudentData] = useState([])
    const url = 'https://quanmgx57hjiqicdxgo2vzebqq0tghim.lambda-url.ap-southeast-1.on.aws'

    useEffect(() =>{
        axios.get(url)
        .then(res => {
            setStudentData(res.data)
        })
        .catch(err => {console.log(err)});
    },[])

    // console.table(studentData)

    const newData = studentData.reduce((accumulator, currentValue) => {
                const existing = accumulator[currentValue.student_id];
                if(existing){
                    accumulator[currentValue.student_id] = {
                        courses: [...existing.courses, currentValue.course_id],
                        gpa: (existing.gpa + currentValue.course_grade)/(existing.courses.length +1)
                    }
                }else{
                    accumulator[currentValue.student_id] = {
                        courses: [currentValue.course_id],
                        gpa: currentValue.course_grade
                    }
                }
                return accumulator;
            }, {})
            
    return(
      <div className='App'>
        <h2>Students</h2>
        <div style={{display: 'flex'}}>
            {Object.keys(newData).map(studentId => {
            const currentStudentData = newData[studentId];
            return(
              <Card>
                <CardHeader title={studentId}/>
                <CardContent>
                  <div>
                    Courses: {currentStudentData.courses.join(",")}
                  </div>
                  <div>
                    GPA: {currentStudentData.gpa}
                  </div>
                </CardContent>
              </Card>)
              })}
        </div>
      </div>
    )
  }



export default App;
