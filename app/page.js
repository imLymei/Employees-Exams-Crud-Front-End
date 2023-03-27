'use client';

import { useEffect, useRef, useState } from 'react';
import { BsTrash3 } from 'react-icons/bs';

export default function Home() {
	const employeeAddName = useRef();
	const examAddName = useRef();
	const registrationAddEmployeeId = useRef();
	const registrationAddExamId = useRef();
	const registrationAddDate = useRef();

	const [employeeAdded, setEmployeeAdded] = useState(false);
	const [examAdded, setExamAdded] = useState(false);
	const [registrationAdded, setRegistrationAdded] = useState(false);

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

	async function addEmployee() {
		const newEmployee = { name: employeeAddName.current.value.trim() };
		employeeAddName.current.value = '';
		const addData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newEmployee),
		};

		const response = await fetch('http://localhost:8080/employee/add', addData);

		if (response.status == 200) {
			setEmployeeAdded(true);
			getAll();
			setTimeout(resetAdded, 5000);
		}
	}

	async function addExam() {
		const newExam = { name: examAddName.current.value.trim() };
		examAddName.current.value = '';
		const addData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newExam),
		};

		const response = await fetch('http://localhost:8080/exam/add', addData).then(
			setExams([...exams, newExam])
		);

		if (response.status == 200) {
			setExamAdded(true);
			getAll();
			setTimeout(resetAdded, 5000);
		}
	}

	async function addRegistration() {
		const newRegistration = {
			date: `${registrationAddDate.current.value}T12:00`,
			employeeId: registrationAddEmployeeId.current.value.trim(),
			examId: registrationAddExamId.current.value.trim(),
		};

		registrationAddDate.current.value = '';
		registrationAddEmployeeId.current.value = '';
		registrationAddExamId.current.value = '';

		const addData = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newRegistration),
		};

		const response = await fetch('http://localhost:8080/registration/add', addData).then(
			setRegistrations([...registrations, newRegistration])
		);

		console.log(response);

		if (response.status == 200) {
			setRegistrationAdded(true);
			getAll();
			setTimeout(resetAdded, 5000);
		}
	}

	async function deleteEmployee(employeeId) {
		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(`http://localhost:8080/employee/delete/${employeeId}`, deleteData);

		if (response.status == 200) {
			getAll();
		}
	}

	async function deleteExam(examId) {
		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(`http://localhost:8080/exam/delete/${examId}`, deleteData);

		if (response.status == 200) {
			getAll();
		}
	}

	function deleteRegistration(registrationId) {
		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		fetch(`http://localhost:8080/registration/delete/${registrationId}`, deleteData).then(
			setRegistrations(
				registrations.filter((registration) => {
					return registration.id != registrationId;
				})
			)
		);
	}

	function getAll() {
		getAllEmployees();
		getAllExams();
		getAllRegistrations();
	}

	function resetAdded() {
		setEmployeeAdded(false);
		setExamAdded(false);
		setRegistrationAdded(false);
	}

	useEffect(() => {
		getAll();
	}, []);

	return (
		<main className='bg-black w-screen h-full flex flex-col items-center p-4'>
			<h2 className='text-2xl'>Employees:</h2>
			<div className='mb-8 relative overflow-visible'>
				<div className='informationCard'>
					{employees.map((employee, index) => {
						return (
							<div key={index} className='propertiesCard'>
								<h3>{employee.name}</h3>
								<h4 className='idData'>{employee.id}</h4>
								<BsTrash3
									className='cursor-pointer absolute right-0 top-0 translate-x-1/2 -translate-y-1/2'
									onClick={() => {
										deleteEmployee(employee.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<div>
					<form className='flex flex-col items-center gap-4'>
						<input
							type='text'
							placeholder='Employee Name'
							className='bg-black border outline-none p-2 w-1/2 border-white/20'
							ref={employeeAddName}
						/>
						<button
							type='button'
							className='border border-white/20 w-1/2 p-2 hover:bg-white/10'
							onClick={addEmployee}>
							Add
						</button>
					</form>
				</div>
				{employeeAdded ? (
					<h5 className='text-teal-400 absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8'>
						Employee Added
					</h5>
				) : null}
			</div>
			<h2 className='text-2xl'>Exams:</h2>
			<div className='mb-8 relative overflow-visible'>
				<div className='informationCard'>
					{exams.map((exam, index) => {
						return (
							<div key={index} className='propertiesCard'>
								<h2>{exam.name}</h2>
								<h4 className='idData'>{exam.id}</h4>
								<BsTrash3
									className='cursor-pointer absolute right-0 top-0 translate-x-1/2 -translate-y-1/2'
									onClick={() => {
										deleteExam(exam.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<form className='flex flex-col items-center gap-4'>
					<input
						type='text'
						placeholder='Exam Name'
						className='bg-black border outline-none p-2 w-1/2 border-white/20'
						ref={examAddName}
					/>
					<button
						type='button'
						className='border border-white/20 w-1/2 p-2 hover:bg-white/10'
						onClick={addExam}>
						Add
					</button>
				</form>
				{examAdded ? (
					<h5 className='text-teal-400 absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8'>
						Exam Added
					</h5>
				) : null}
			</div>
			<h2 className='text-2xl'>Registrations of exams done by employees:</h2>
			<div className='mb-8 relative overflow-visible'>
				<div className='informationCard'>
					{registrations.map((registration, index) => {
						return (
							<div key={index} className='propertiesCard'>
								<h3>Employee: {getEmployeeInformation(registration)}</h3>
								<h3>Exam: {getExamInformation(registration)}</h3>
								<h3>
									Date:{' '}
									{`${dateFormat(new Date(registration.date).getDate())}/${dateFormat(
										new Date(registration.date).getMonth() + 1
									)}/${new Date(registration.date).getFullYear()}`}
								</h3>
								<h4 className='idData'>{registration.id}</h4>
								<BsTrash3
									className='cursor-pointer absolute right-0 top-0 translate-x-1/2 -translate-y-1/2'
									onClick={() => {
										deleteRegistration(registration.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<form className='flex flex-col items-center gap-4'>
					<input
						type='text'
						placeholder='Employee Id'
						className='bg-black border outline-none p-2 w-1/2 border-white/20'
						ref={registrationAddEmployeeId}
					/>
					<input
						type='text'
						placeholder='Exam Id'
						className='bg-black border outline-none p-2 w-1/2 border-white/20'
						ref={registrationAddExamId}
					/>
					<input
						type='date'
						className='bg-black border outline-none p-2 w-1/2 border-white/20'
						ref={registrationAddDate}
					/>
					<button
						type='button'
						className='border border-white/20 w-1/2 p-2 hover:bg-white/10'
						onClick={addRegistration}>
						Add
					</button>
				</form>
				{registrationAdded ? (
					<h5 className='text-teal-400 absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8'>
						Registration Added
					</h5>
				) : null}
			</div>
		</main>
	);
}
