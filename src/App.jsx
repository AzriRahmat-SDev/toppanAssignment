import React, {useState,useEffect} from 'react';
import './App.css';
import {Card, CardHeader,CardContent} from "@mui/material"
import LoadingPage from './components/LoadingPage'
import axios from 'axios'
import 'tachyons'

const App = () => {

  const [studentData, setStudentData] = useState([])
  const [loading, setLoading] = useState(true)

    const url = 'https://quanmgx57hjiqicdxgo2vzebqq0tghim.lambda-url.ap-southeast-1.on.aws'

    useEffect(() =>{
      let interval = setInterval(getData,2000)
      setInterval(() =>{
        clearInterval(interval)
      },4000)
    },[])

    function getData(){
      axios.get(url, {name: "fetching"}, { timeout: 1000})
        .then(res => {
            setStudentData(res.data)
            setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(true)
        });
        
    }

    console.table(studentData)
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
        { loading ? 
        <LoadingPage/>
        :
        <div>
        <h2 className="tc">Students</h2>
        <div className="mw9 center ph5-ns">
            {Object.keys(newData).map(studentId => {
            const currentStudentData = newData[studentId];
            return(
              <Card className="br3 pa3 ma2 bw2 shadow-5 fl w5" >
                <CardContent>
                  <div>Student</div>
                </CardContent>
                <CardHeader title={studentId}/>
                <CardContent>
                  <div className="textWrap">
                    {currentStudentData.courses.join(",")}
                  </div>
                  <div className="textWrap">
                    GPA: {(currentStudentData.gpa).toFixed(2)}
                  </div>
                </CardContent>
              </Card>)
              })}
        </div>
        </div>
        
      }
        
      </div>
    )
  }



export default App;
