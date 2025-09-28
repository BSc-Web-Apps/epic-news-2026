import { Link, useLoaderData } from 'react-router'
import { type Route } from './+types/root.ts'
import { type loader } from './__root.server.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'
import HeroCallToAction from './components/organisms/Hero/HeroCallToAction.tsx'
import Document from './components/shared-layout/Document.tsx'
import { Button } from './components/ui/button.tsx'
import { ThemeSwitch, useTheme } from './routes/resources+/theme-switch.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import rootLinkElements from './utils/providers/rootLinkElements.ts'
import heroImage from '~/assets/jpg/sample-hero.jpg'

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
					<main className="h-full">
						<HeroCallToAction
							image={heroImage}
							imageRight={true}
							hasBackgroundColour={true}
						>
							<div className="flex h-full flex-1 flex-col justify-between p-16">
								<div className="flex flex-col gap-8">
									<h2 className="text-h2">Welcome to Epic News</h2>
									<p className="text-lg">
										Keep up to date with the latest tech news.
									</p>
								</div>
								<Button asChild variant="default" size="lg">
									<Link to="/signup">Sign up</Link>
								</Button>
							</div>
						</HeroCallToAction>
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
