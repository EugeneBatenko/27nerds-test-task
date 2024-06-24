import React, { FormEvent, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import client from '../../lib/apollo';
import { LOGIN_USER } from '../../mutations/login'

export default  function Index() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	
	const [login, { loading }] = useMutation(LOGIN_USER, {
		client,
		onCompleted: (data) => {
			if (data.login.authToken) {
				Cookies.set('token', data.login.authToken);
				router.push('/');
			}
		},
		onError: (error) => {
			setError(error.message);
		},
	});
	
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');
		await login({ variables: { username, password } });
	};
	
	return (
		<section className="container">
			<div className="bg-white p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
				<h1 className="text-center text-blue-400 font-bold text-2xl uppercase mb-10">Login</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-5">
						<label htmlFor="username" className="block mb-2 font-bold text-gray-600">Username</label>
						<input
							className="border border-gray-300 shadow p-3 w-full rounded mb-"
							type="text"
							id="username"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-5">
						<label htmlFor="password" className="block mb-2 font-bold text-gray-600">Password</label>
						<input
							className="border border-gray-300 shadow p-3 w-full rounded mb-"
							type="password"
							id="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<button className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg" type="submit" disabled={loading}>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</section>
	);
};
