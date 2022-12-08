import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardContent } from '@mui/material';
import LoadingPage from './components/LoadingPage';
import 'tachyons';

const App = () => {
	const [studentData, setStudentData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const url =
		'https://quanmgx57hjiqicdxgo2vzebqq0tghim.lambda-url.ap-southeast-1.on.aws';

	useEffect(() => {
		fetchWithRetry(getDataFromApi, 2);
	}, []);

	async function fetchWithRetry(getDataFromApi, maxRetryCount) {
		return new Promise((resolve, reject) => {
			let retry = 0;
			const caller = () =>
				getDataFromApi()
					.then((data) => {
						setLoading(false);
						resolve(data);
					})
					.catch((error) => {
						setLoading(true);
						if (retry < maxRetryCount) {
							retry++;
							setTimeout(() => {
								caller();
							}, 2000);
						} else {
							setError(true);
							reject(error);
						}
					});
			retry = 0;
			caller();
		});
	}

	async function getDataFromApi() {
		console.log('Fetching...');
		const rawResponse = await fetch(url);
		const jsonResponse = await rawResponse.json();
		setStudentData(jsonResponse);
	}

	function handleRetryClick() {
		setError(false);
		fetchWithRetry(getDataFromApi, 2);
	}

	console.table(studentData);
	const newData = studentData.reduce((accumulator, currentValue) => {
		const existing = accumulator[currentValue.student_id];
		if (existing) {
			accumulator[currentValue.student_id] = {
				courses: [...existing.courses, currentValue.course_id],
				gpa:
					(existing.gpa + currentValue.course_grade) /
					(existing.courses.length + 1),
			};
		} else {
			accumulator[currentValue.student_id] = {
				courses: [currentValue.course_id],
				gpa: currentValue.course_grade,
			};
		}
		return accumulator;
	}, {});

	return (
		<div className="App">
			<h2 className="tc f2 lh-copy">Students</h2>
			{loading ? (
				<LoadingPage error={error} handleRetryClick={handleRetryClick} />
			) : (
				<div>
					<div className="mw9 center ph5-ns">
						{Object.keys(newData).map((studentId) => {
							const currentStudentData = newData[studentId];
							return (
								<Card
									sx={{ borderRadius: '12px' }}
									className="pa3 ma2 bw2 shadow-5 fl w5"
								>
									<CardContent>
										<div>Student</div>
									</CardContent>
									<CardHeader title={studentId} />
									<CardContent>
										<div className="textWrap">
											{currentStudentData.courses.join(',')}
										</div>
										<div className="textWrap">
											GPA: {currentStudentData.gpa.toFixed(2)}
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
