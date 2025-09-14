import { type MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [{ title: 'Epic News' }]

export default function Index() {
	return (
		<main className="grid h-full place-items-center">
			<h1 className="text-mega">
				Hello from{' '}
				<pre className="prose bg-primary text-primary-foreground rounded-lg p-6">
					app/routes/_index.tsx
				</pre>
			</h1>
		</main>
	)
}
