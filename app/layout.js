import './globals.css';

export const metadata = {
	title: 'Gerenciador de Exames para Funcionários',
	description: 'Next.js + Java Rest API',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
