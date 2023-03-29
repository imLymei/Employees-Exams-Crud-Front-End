'use client';

import { useEffect, useRef, useState } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import Foot from '../Foot';

export default function Home() {
	const [logged, setLogged] = useState(false);

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

	const [examsRank, setExamsRank] = useState([]);

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
		event.preventDefault();
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

		renderMostDone(response);
	}

	function dateFormat(date) {
		if (date < 10) {
			return `0${date}`;
		} else return date;
	}

	function containsOnlyNumbers(str) {
		return /^\d+$/.test(str);
	}

	function getExamInformation(examId) {
		let response = 'Not Found';
		exams.map((exam) => {
			if (exam.id == examId) {
				response = exam.name;
			}
		});
		return response;
	}

	function getEmployeeInformation(employeeId) {
		let response = 'Not Found';
		employees.map((employee) => {
			if (employee.id == employeeId) {
				response = employee.name;
			}
		});
		return response;
	}

	async function addEmployee() {
		event.preventDefault();
		const newEmployee = { name: employeeAddName.current.value.trim() };

		if (newEmployee.name.length < 3) {
			setEmployeeStatus([false, 'error: O nome não pode conter menos de 3 caracteres']);
			setTimeout(resetStatus, 10000);
			return;
		}

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
		event.preventDefault();
		const updateId = employeeUpdateId.current.value.trim();
		const updateName = employeeUpdateName.current.value.trim();

		employeeUpdateId.current.value = '';
		employeeUpdateName.current.value = '';

		if (updateName.length < 3) {
			setEmployeeStatus([false, 'error: O nome não pode conter menos de 3 caracteres']);
			setTimeout(resetStatus, 10000);
			return;
		}

		if (!containsOnlyNumbers(updateId)) {
			setEmployeeStatus([false, 'error: O ID deve conter apenas números']);
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
				name: updateName,
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
		event.preventDefault();
		const newExam = { name: examAddName.current.value.trim() };

		if (newExam.name.length < 3) {
			setExamStatus([false, 'error: O nome não pode conter menos de 3 caracteres']);
			setTimeout(resetStatus, 10000);
			return;
		}

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
		event.preventDefault();
		const updateId = examUpdateId.current.value.trim();
		const updateName = examUpdateName.current.value.trim();

		if (updateName.length < 3) {
			setExamStatus([false, 'error: O nome não pode conter menos de 3 caracteres']);
			setTimeout(resetStatus, 10000);
			return;
		}

		if (!containsOnlyNumbers(updateId)) {
			setExamStatus([false, 'error: O ID deve conter apenas números']);
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
		event.preventDefault();
		const newRegistration = {
			date: `${registrationAddDate.current.value}T12:00`,
			employeeId: registrationAddEmployeeId.current.value.trim(),
			examId: registrationAddExamId.current.value.trim(),
		};

		registrationAddDate.current.value = '';
		registrationAddEmployeeId.current.value = '';
		registrationAddExamId.current.value = '';

		if (
			newRegistration.date.length < 10 ||
			!containsOnlyNumbers(newRegistration.employeeId) ||
			!containsOnlyNumbers(newRegistration.examId)
		) {
			setRegistrationStatus([false, 'error: Os IDS e a data precisam ser válidos']);
			setTimeout(resetStatus, 10000);
			return;
		}

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
		event.preventDefault();
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

	function deleteRegistration(registrationId, registrationList) {
		const deleteData = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		fetch(`http://localhost:8080/registration/delete/${registrationId}`, deleteData).then(
			setRegistrations(
				registrationList.filter((registration) => {
					return registration.id != registrationId;
				})
			)
		);
	}

	function findMostDone(response) {
		let examsList = [];
		let foundExams = [];

		response.map((registration, index) => {
			examsList.push(registration.examId);
		});

		examsList.forEach((exam) => {
			if (foundExams.length == 0) {
				foundExams.push({ id: exam, amount: 1 });
			} else {
				let found = false;
				foundExams.forEach((foundExam) => {
					if (foundExam.id == exam) {
						foundExam.amount++;
						found = true;
					}
				});
				if (!found) {
					foundExams.push({ id: exam, amount: 1 });
				}
			}
		});

		return foundExams;
	}

	function renderMostDone(response) {
		const examsList = findMostDone(response);
		let examsRankList = [];

		let firstPlace = { id: 0, amount: -1 };
		let secondPlace = { id: 0, amount: -1 };
		let thirdPlace = { id: 0, amount: -1 };
		let fourthPlace = { id: 0, amount: -1 };
		let fifthPlace = { id: 0, amount: -1 };

		examsList.forEach((exam) => {
			if (exam.amount > firstPlace.amount) {
				fifthPlace = fourthPlace;
				fourthPlace = thirdPlace;
				thirdPlace = secondPlace;
				secondPlace = firstPlace;
				firstPlace = exam;
			} else {
				if (exam.amount > secondPlace.amount) {
					fifthPlace = fourthPlace;
					fourthPlace = thirdPlace;
					thirdPlace = secondPlace;
					secondPlace = exam;
				} else {
					if (exam.amount > thirdPlace.amount) {
						fifthPlace = fourthPlace;
						fourthPlace = thirdPlace;
						thirdPlace = exam;
					} else {
						if (exam.amount > fourthPlace.amount) {
							fifthPlace = fourthPlace;
							fourthPlace = exam;
						} else {
							if (exam.amount > fifthPlace.amount) {
								fifthPlace = exam;
							}
						}
					}
				}
			}
		});

		if (firstPlace.amount != -1) {
			examsRankList.push(firstPlace);
		}
		if (secondPlace.amount != -1) {
			examsRankList.push(secondPlace);
		}
		if (thirdPlace.amount != -1) {
			examsRankList.push(thirdPlace);
		}
		if (fourthPlace.amount != -1) {
			examsRankList.push(fourthPlace);
		}
		if (fifthPlace.amount != -1) {
			examsRankList.push(fifthPlace);
		}

		setExamsRank([...examsRankList]);
	}

	function logout() {
		window.localStorage.removeItem('logged');
		window.localStorage.removeItem('username');
		window.location.reload();
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
		setLogged(window.localStorage.getItem('logged'));
	}, []);

	function notLoggedPage() {
		return (
			<div className='flex flex-col justify-center items-center bg-black w-screen h-screen'>
				<h1>Você precisa estar logado para acessar esse site.</h1>
				<h2>
					Clique <a href='/'>AQUI</a> para fazer login.
				</h2>
			</div>
		);
	}

	function loggedPage() {
		return (
			<div className='bg-black w-screen h-full flex flex-col items-center p-4'>
				<h2 className='text-2xl'>Funcionários:</h2>
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
								placeholder='Nome do Funcionário'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={employeeAddName}
							/>
							<button className='border border-white/20 w-full p-2 hover:bg-white/10' onClick={addEmployee}>
								Adicionar
							</button>
						</form>
						<form className='flex flex-col items-center gap-4'>
							<div className='flex w-full gap-2'>
								<input
									type='text'
									placeholder='ID do Funcionário'
									className='bg-black border outline-none p-2 w-1/2 border-white/20'
									ref={employeeUpdateId}
								/>
								<input
									type='text'
									placeholder='Nome do Funcionário'
									className='bg-black border outline-none p-2 w-1/2 border-white/20'
									ref={employeeUpdateName}
								/>
							</div>
							<button
								className='border border-white/20 w-full p-2 hover:bg-white/10'
								onClick={updateEmployee}>
								Atualizar
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
				<h2 className='text-2xl'>Exames:</h2>
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
								placeholder='Nome do exame'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={examAddName}
							/>
							<button className='border border-white/20 w-full p-2 hover:bg-white/10' onClick={addExam}>
								Adicionar
							</button>
						</form>
						<form className='flex flex-col items-center gap-4'>
							<div className='flex w-full gap-2'>
								<input
									type='text'
									placeholder='ID do exame'
									className='bg-black border outline-none p-2 w-1/2 border-white/20'
									ref={examUpdateId}
								/>
								<input
									type='text'
									placeholder='Nome do exame'
									className='bg-black border outline-none p-2 w-1/2 border-white/20'
									ref={examUpdateName}
								/>
							</div>
							<button className='border border-white/20 w-full p-2 hover:bg-white/10' onClick={updateExam}>
								Atualizar
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
				<h2 className='text-2xl'>Registro dos exames efetuados:</h2>
				<div className='sectionsCard'>
					<div className='informationCard'>
						{registrations.map((registration, index) => {
							return (
								<div key={index} className='propertiesCard'>
									<h3>Employee: {getEmployeeInformation(registration.employeeId)}</h3>
									<h3>Exam: {getExamInformation(registration.examId)}</h3>
									<h3>
										Date:{' '}
										{`${dateFormat(new Date(registration.date).getDate())}/${dateFormat(
											new Date(registration.date).getMonth() + 1
										)}/${new Date(registration.date).getFullYear()}`}
									</h3>
									<h4 className='idData'>{registration.id}</h4>
								</div>
							);
						})}
					</div>
					<div className='grid grid-cols-2 gap-2 w-[50vw]'>
						<form className='flex flex-col items-center gap-4'>
							<input
								type='text'
								placeholder='ID do Funcionário'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={registrationAddEmployeeId}
							/>
							<input
								type='text'
								placeholder='ID do exame'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={registrationAddExamId}
							/>
							<input
								type='date'
								className='bg-black border outline-none p-2 w-full border-white/20'
								ref={registrationAddDate}
							/>
							<button
								className='border border-white/20 w-full p-2 hover:bg-white/10'
								onClick={addRegistration}>
								Adicionar
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
								className='border border-white/20 w-full p-2 hover:bg-white/10'
								onClick={updateRegistration}>
								Atualizar
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
									<h3>Employee: {getEmployeeInformation(registration.employeeId)}</h3>
									<h3>Exam: {getExamInformation(registration.examId)}</h3>
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
											deleteRegistration(registration.id, registrationsBetweenDates);
										}}
									/>
								</div>
							);
						})}
						{examsRank.length != 0 ? (
							<div className='absolute right-0 top-4 p-2 translate-x-full border border-white flex flex-col items-center gap-2'>
								<h3>Exames mais realizados do período:</h3>

								{examsRank.map((exam, index) => {
									return (
										<div key={index} className='w-3/4 text-center border border-white p-2'>
											<h4>{getExamInformation(exam.id)}</h4>
											<h4>Quantidade: {exam.amount}</h4>
										</div>
									);
								})}
							</div>
						) : null}
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
						<button className='border border-white/20 w-full p-2 hover:bg-white/10' onClick={getAllBetween}>
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
				<div className='absolute right-4'>
					<h5 className='mb-2 text-sm'>Logado com {window.localStorage.getItem('username')}</h5>
					<button
						type='button'
						className='p-2 border border-white/20 w-24 hover:bg-white/10 '
						onClick={logout}>
						Sair
					</button>
				</div>
			</div>
		);
	}

	return (
		<main className='bg-black w-screen h-full flex flex-col items-center'>
			{logged ? loggedPage() : notLoggedPage()}
			<Foot />
		</main>
	);
}
