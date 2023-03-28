'use client';

import { useEffect, useRef, useState } from 'react';
import { BsTrash3 } from 'react-icons/bs';

export default function Home() {
	const employeeAddName = useRef();
	const employeeUpdateId = useRef();
	const employeeUpdateName = useRef();

	const examAddName = useRef();
	const examUpdateId = useRef();
	const examUpdateName = useRef();

	const registrationAddEmployeeId = useRef();
	const registrationAddExamId = useRef();
	const registrationAddDate = useRef();

	const registrationUpdateId = useRef();
	const registrationUpdateEmployeeId = useRef();
	const registrationUpdateExamId = useRef();
	const registrationUpdateDate = useRef();

	const registrationSearchInitialDate = useRef();
	const registrationSearchFinalDate = useRef();

	const [employeeStatus, setEmployeeStatus] = useState([false, '']);
	const [examStatus, setExamStatus] = useState([false, '']);
	const [registrationStatus, setRegistrationStatus] = useState([false, '']);
	const [registrationSearchStatus, setRegistrationSearchStatus] = useState([false, '']);

	const [employees, setEmployees] = useState([]);
	const [exams, setExams] = useState([]);
	const [registrations, setRegistrations] = useState([]);
	const [registrationsBetweenDates, setRegistrationsBetweenDates] = useState([]);

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

	async function getAllBetween() {
		const initialDate = registrationSearchInitialDate.current.value;
		const finalDate = registrationSearchFinalDate.current.value;

		if (initialDate.length < 10 || finalDate.length < 10) {
			setRegistrationSearchStatus([false, 'error: As datas precisam ser válidas']);
			setTimeout(resetStatus, 10000);
			return;
		}

		const getAllBetweenData = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await fetch(
			`http://localhost:8080/registration/getReport/${initialDate}T12:00/${finalDate}T12:00`,
			getAllBetweenData
		);
		const response = await res.json();

		setRegistrationsBetweenDates(response);

		if (response.length < 1) {
			setRegistrationSearchStatus([false, 'Nenhum registro encontrado']);
			setTimeout(resetStatus, 10000);
		}
	}

	function dateFormat(date) {
		if (date < 10) {
			return `0${date}`;
		} else return date;
	}

	function containsOnlyNumbers(str) {
		return /^\d+$/.test(str);
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

		const res = await fetch('http://localhost:8080/employee/add', addData);

		if (res.status == 200) {
			setEmployeeStatus([true, 'Funcionário adicionado']);
			getAll();
			setTimeout(resetStatus, 10000);
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

	async function updateEmployee() {
		const updatedId = employeeUpdateId.current.value.trim();
		const updatedName = employeeUpdateName.current.value.trim();

		employeeUpdateId.current.value = '';
		employeeUpdateName.current.value = '';

		if (updatedName.length < 3) {
			setEmployeeStatus([false, 'error: O nome não pode conter menos de 3 caracteres']);
			setTimeout(resetStatus, 10000);
			return;
		}

		const updateData = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: updatedId,
				name: updatedName,
			}),
		};

		const res = await fetch('http://localhost:8080/employee/update', updateData);
		const response = (await res.json()).message.split('/');

		if (response[0] == 'success') {
			setEmployeeStatus([true, response[1]]);
			getAll();
			setTimeout(resetStatus, 10000);
		} else {
			setEmployeeStatus([false, `${response[0]}: ${response[1]}`]);
			setTimeout(resetStatus, 10000);
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

		const res = await fetch('http://localhost:8080/exam/add', addData).then(setExams([...exams, newExam]));

		if (res.status == 200) {
			setExamStatus([true, 'Exame adicionado']);
			getAll();
			setTimeout(resetStatus, 10000);
		}
	}

	async function updateExam() {
		const updateId = examUpdateId.current.value.trim();
		const updateName = examUpdateName.current.value.trim();

		if (updateName.length < 3) {
			setExamStatus([false, 'error: O nome não pode conter menos de 3 caracteres']);
			setTimeout(resetStatus, 10000);
			return;
		}

		const updateData = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: updateId, name: updateName }),
		};

		const res = await fetch('http://localhost:8080/exam/update', updateData);
		const response = (await res.json()).message.split('/');

		if (response[0] == 'success') {
			setExamStatus([true, response[1]]);
			getAll();
			setTimeout(resetStatus, 10000);
		} else {
			setExamStatus([false, `${response[0]}: ${response[1]}`]);
			setTimeout(resetStatus, 10000);
		}
	}

	async function deleteExam(examId) {
		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await fetch(`http://localhost:8080/exam/delete/${examId}`, deleteData);
		const response = (await res.json()).message.split('/');

		if (response[0] == 'success') {
			getAll();
		} else {
			setExamStatus([false, `${response[0]}: ${response[1]}`]);
			setTimeout(resetStatus, 10000);
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

		const res = await fetch('http://localhost:8080/registration/add', addData);

		const response = (await res.json()).message.split('/');

		if (response[0] == 'success') {
			setRegistrationStatus([true, 'Registro adicionado']);
			getAll();
			setTimeout(resetStatus, 10000);
		} else {
			setRegistrationStatus([false, `${response[0]}: ${response[1]}`]);
			setTimeout(resetStatus, 10000);
		}
	}

	async function updateRegistration() {
		const updateId = registrationUpdateId.current.value.trim();
		const updateEmployeeId = registrationUpdateEmployeeId.current.value.trim();
		const updateExamId = registrationUpdateExamId.current.value.trim();
		const updateDate = registrationUpdateDate.current.value;

		registrationUpdateId.current.value = '';
		registrationUpdateEmployeeId.current.value = '';
		registrationUpdateExamId.current.value = '';
		registrationUpdateDate.current.value = '';

		if (
			updateDate.length < 10 ||
			updateId.length < 1 ||
			updateEmployeeId.length < 1 ||
			updateExamId.length < 1
		) {
			setRegistrationStatus([false, 'error: Os IDs e a data precisam ser válidos']);
			setTimeout(resetStatus, 10000);
			return;
		}

		if (
			!containsOnlyNumbers(updateId) ||
			!containsOnlyNumbers(updateEmployeeId) ||
			!containsOnlyNumbers(updateExamId)
		) {
			setRegistrationStatus([false, 'error: Os IDs e a data precisam ser válidos']);
			setTimeout(resetStatus, 10000);
			return;
		}

		const updateData = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: updateId,
				date: `${updateDate}T12:00`,
				employeeId: updateEmployeeId,
				examId: updateExamId,
			}),
		};

		const res = await fetch('http://localhost:8080/registration/update', updateData);
		const response = (await res.json()).message.split('/');

		if (response[0] == 'success') {
			setRegistrationStatus([true, response[1]]);
			getAll();
			setInterval(resetStatus, 10000);
		} else {
			setRegistrationStatus([false, `${response[0]}: ${response[1]}`]);
			setTimeout(resetStatus, 10000);
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

	function resetStatus() {
		setEmployeeStatus([false, '']);
		setExamStatus([false, '']);
		setRegistrationStatus([false, '']);
		setRegistrationSearchStatus([false, '']);
	}

	useEffect(() => {
		getAll();
	}, []);

	return (
		<main className='bg-black w-screen h-full flex flex-col items-center p-4'>
			<h2 className='text-2xl'>Employees:</h2>
			<div className='sectionsCard'>
				<div className='informationCard'>
					{employees.map((employee, index) => {
						return (
							<div key={index} className='propertiesCard'>
								<h3>{employee.name}</h3>
								<h4 className='idData'>{employee.id}</h4>
								<BsTrash3
									className='trashCan'
									onClick={() => {
										deleteEmployee(employee.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<div className='grid grid-cols-2 gap-2 w-[50vw]'>
					<form className='flex flex-col items-center gap-4'>
						<input
							type='text'
							placeholder='Employee Name'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={employeeAddName}
						/>
						<button
							type='button'
							className='border border-white/20 w-full p-2 hover:bg-white/10'
							onClick={addEmployee}>
							Add
						</button>
					</form>
					<form className='flex flex-col items-center gap-4'>
						<div className='flex w-full gap-2'>
							<input
								type='text'
								placeholder='Employee ID'
								className='bg-black border outline-none p-2 w-1/2 border-white/20'
								ref={employeeUpdateId}
							/>
							<input
								type='text'
								placeholder='Employee Name'
								className='bg-black border outline-none p-2 w-1/2 border-white/20'
								ref={employeeUpdateName}
							/>
						</div>
						<button
							type='button'
							className='border border-white/20 w-full p-2 hover:bg-white/10'
							onClick={updateEmployee}>
							Update
						</button>
					</form>
				</div>
				<h5
					className={`${
						employeeStatus[0] ? 'text-teal-400' : 'text-red-400'
					} absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8 whitespace-nowrap`}>
					{employeeStatus[1]}
				</h5>
			</div>
			<h2 className='text-2xl'>Exams:</h2>
			<div className='sectionsCard'>
				<div className='informationCard'>
					{exams.map((exam, index) => {
						return (
							<div key={index} className='propertiesCard'>
								<h2>{exam.name}</h2>
								<h4 className='idData'>{exam.id}</h4>
								<BsTrash3
									className='trashCan'
									onClick={() => {
										deleteExam(exam.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<div className='grid grid-cols-2 gap-2 w-[50vw]'>
					<form className='flex flex-col items-center gap-4'>
						<input
							type='text'
							placeholder='Exam Name'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={examAddName}
						/>
						<button
							type='button'
							className='border border-white/20 w-full p-2 hover:bg-white/10'
							onClick={addExam}>
							Add
						</button>
					</form>
					<form className='flex flex-col items-center gap-4'>
						<div className='flex w-full gap-2'>
							<input
								type='text'
								placeholder='Exam ID'
								className='bg-black border outline-none p-2 w-1/2 border-white/20'
								ref={examUpdateId}
							/>
							<input
								type='text'
								placeholder='Exam Name'
								className='bg-black border outline-none p-2 w-1/2 border-white/20'
								ref={examUpdateName}
							/>
						</div>
						<button
							type='button'
							className='border border-white/20 w-full p-2 hover:bg-white/10'
							onClick={updateExam}>
							Update
						</button>
					</form>
				</div>
				<h5
					className={`${
						examStatus[0] ? 'text-teal-400' : 'text-red-400'
					} absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8 whitespace-nowrap`}>
					{examStatus[1]}
				</h5>
			</div>
			<h2 className='text-2xl'>Registrations of exams done by employees:</h2>
			<div className='sectionsCard'>
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
									className='trashCan'
									onClick={() => {
										deleteRegistration(registration.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<div className='grid grid-cols-2 gap-2 w-[50vw]'>
					<form className='flex flex-col items-center gap-4'>
						<input
							type='text'
							placeholder='Employee ID'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={registrationAddEmployeeId}
						/>
						<input
							type='text'
							placeholder='Exam ID'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={registrationAddExamId}
						/>
						<input
							type='date'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={registrationAddDate}
						/>
						<button
							type='button'
							className='border border-white/20 w-full p-2 hover:bg-white/10'
							onClick={addRegistration}>
							Add
						</button>
					</form>
					<form className='flex flex-col items-center gap-4'>
						<input
							type='text'
							placeholder='ID do Registro'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={registrationUpdateId}
						/>
						<div className='flex gap-2 w-full'>
							<input
								type='text'
								placeholder='ID do Funcionário'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={registrationUpdateEmployeeId}
							/>
							<input
								type='text'
								placeholder='ID do Exame'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={registrationUpdateExamId}
							/>
						</div>
						<input
							type='date'
							className='bg-black border outline-none p-2 w-full border-white/20'
							ref={registrationUpdateDate}
						/>
						<button
							type='button'
							className='border border-white/20 w-full p-2 hover:bg-white/10'
							onClick={updateRegistration}>
							Update
						</button>
					</form>
				</div>
				<h5
					className={`${
						registrationStatus[0] ? 'text-teal-400' : 'text-red-400'
					} absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8 whitespace-nowrap`}>
					{registrationStatus[1]}
				</h5>
			</div>
			<h2 className='text-2xl'>Registros entre as datas:</h2>
			<div className='sectionsCard'>
				<div className='informationCard'>
					{registrationsBetweenDates.map((registration, index) => {
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
									className='trashCan'
									onClick={() => {
										deleteRegistration(registration.id);
									}}
								/>
							</div>
						);
					})}
				</div>
				<form className='flex flex-col w-[50vw] items-center gap-4'>
					<div className='flex items-center w-full gap-2 relative'>
						<h3 className='w-[4%]'>De:</h3>
						<input
							type='date'
							className='bg-black border outline-none p-2 w-[46%] border-white/20'
							ref={registrationSearchInitialDate}
						/>
						<h3 className='w-[4%]'>Até: </h3>
						<input
							type='date'
							className='bg-black border outline-none p-2 w-[46%] border-white/20'
							ref={registrationSearchFinalDate}
						/>
						<h4 className='absolute text-xs text-white/10 left-3/4'>Data não inclusa</h4>
					</div>
					<button
						type='button'
						className='border border-white/20 w-full p-2 hover:bg-white/10'
						onClick={getAllBetween}>
						Procurar
					</button>
				</form>
				<h5
					className={`${
						registrationSearchStatus[0] ? 'text-teal-400' : 'text-red-400'
					} absolute right-1/2 bottom-0 translate-x-1/2 translate-y-8 whitespace-nowrap`}>
					{registrationSearchStatus[1]}
				</h5>
			</div>
		</main>
	);
}
