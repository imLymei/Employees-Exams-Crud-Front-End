'use client';

import { useEffect, useState } from 'react';

export default function Home() {
	const [employees, setEmployees] = useState([]);
	const [exams, setExams] = useState([]);
	const [registrations, setRegistrations] = useState([]);

	async function getAllEmployees() {
		const getAllData = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await fetch('http://localhost:8080/employee/getAll', getAllData);
		const response = await res.json();

		setEmployees(response);
	}

	async function getAllExams() {
		const getAllData = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await fetch('http://localhost:8080/exam/getAll', getAllData);
		const response = await res.json();

		setExams(response);
	}

	async function getAllRegistrations() {
		const getAllData = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await fetch('http://localhost:8080/registration/getAll', getAllData);
		const response = await res.json();

		setRegistrations(response);
	}

	function dateFormat(date) {
		if (date < 10) {
			return `0${date}`;
		} else return date;
	}

	function getExamInformation(registration) {
		let response = 'Not Found';
		exams.map((exam) => {
			if (exam.id == registration.examId) {
				response = exam.name;
			}
		});
		return response;
	}

	function getEmployeeInformation(registration) {
		let response = 'Not Found';
		employees.map((employee) => {
			if (employee.id == registration.employeeId) {
				response = employee.name;
			}
		});
		return response;
	}

	useEffect(() => {
		getAllEmployees();
		getAllExams();
		getAllRegistrations();
	}, []);

	return (
		<main className='bg-black w-screen h-full flex flex-col items-center p-4'>
			<h2 className='text-2xl m-4'>Employees:</h2>
			<div className='informationCard'>
				{employees.map((employee) => {
					return (
						<div key={employee.id} className='propertiesCard'>
							<h3>{employee.name}</h3>
						</div>
					);
				})}
			</div>
			<h2 className='text-2xl m-4'>Exams:</h2>
			<div className='informationCard'>
				{exams.map((exam) => {
					return (
						<div key={exam.id} className='propertiesCard'>
							<h2>{exam.name}</h2>
						</div>
					);
				})}
			</div>
			<h2 className='text-2xl m-4'>Registrations of exams done by employees:</h2>
			<div className='informationCard'>
				{registrations.map((registration) => {
					return (
						<div key={registration.id} className='propertiesCard'>
							<h3>Employee: {getEmployeeInformation(registration)}</h3>
							<h3>Exam: {getExamInformation(registration)}</h3>
							<h3>
								Date:{' '}
								{`${dateFormat(new Date(registration.date).getDate())}/${dateFormat(
									new Date(registration.date).getMonth() + 1
								)}/${new Date(registration.date).getFullYear()}`}
							</h3>
						</div>
					);
				})}
			</div>
		</main>
	);
}
