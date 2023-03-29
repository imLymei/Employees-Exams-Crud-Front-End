'use client';

import { useRef, useState } from 'react';

export default function Home() {
	const usernameLogin = useRef();
	const passwordLogin = useRef();

	const [loginStatus, setLoginStatus] = useState([false, '']);

	async function login() {
		event.preventDefault();
		const username = usernameLogin.current.value.trim();
		const password = passwordLogin.current.value.trim();
		const account = { username: username, password: password };

		const loginData = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(account),
		};

		const res = await fetch('http://localhost:8080/account/login', loginData);
		const response = (await res.json()).message.split('/');

		if (response[0] == 'success') {
			localStorage.setItem('logged', true);
			localStorage.setItem('username', username);
			setLoginStatus([true, response[1]]);
			window.location.href = '/hub';
		} else {
			setLoginStatus([false, response[1]]);
		}
	}

	if (!localStorage.getItem('logged')) {
		return (
			<main className='bg-black flex flex-col items-center justify-center w-screen h-screen'>
				<h1 className='text-2xl m-12'>Sistema de Gerenciamento de Exames para Funcionários</h1>
				<form className='flex flex-col items-center justify-center border border-white p-6 gap-2'>
					<h3 className='self-start'>Usuário:</h3>
					<input
						type='text'
						placeholder='Ex. Rodrigo Fernandes'
						ref={usernameLogin}
						className='p-2 bg-black border border-white outline-none'
					/>
					<h3 className='self-start'>Senha:</h3>
					<input
						type='password'
						placeholder='Ex .ViagensPara100pre'
						ref={passwordLogin}
						className='p-2 bg-black border border-white outline-none'
					/>
					<button onClick={login} className='border border-white p-2 w-full hover:bg-white/10'>
						Logar
					</button>
					<h4>{loginStatus[1]}</h4>
				</form>
			</main>
		);
	} else {
		window.location.href = '/hub';
	}
}
