import { useLoaderData } from 'react-router'
import { type Route } from './+types/root.ts'
import { type loader } from './__root.server.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import Document from './components/shared-layout/Document.tsx'
import { ThemeSwitch, useTheme } from './routes/resources+/theme-switch.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import rootLinkElements from './utils/providers/rootLinkElements.ts'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight'

export const links: Route.LinksFunction = () => {
	return rootLinkElements
}
export { meta } from './__root.client.tsx'
export { headers, loader } from './__root.server.tsx'

export default function App() {
	const data = useLoaderData<typeof loader | null>()
	const nonce = useNonce()
	const theme = useTheme()

	return (
		<Document theme={theme} nonce={nonce} honeyProps={data?.honeyProps}>
			<div className="flex h-screen flex-col justify-between">
				<HeaderWithSearch />

				<div className="flex-1">
					<main className="grid h-full place-items-center">
						<h1 className="text-mega">Welcome to Epic News!</h1>
					</main>
				</div>

				<div className="container flex justify-between pb-5">
					<ThemeSwitch userPreference={data?.requestInfo.userPrefs.theme} />
				</div>

				<FooterMenuRight />
			</div>
		</Document>
	)
}

export const ErrorBoundary = GeneralErrorBoundary
