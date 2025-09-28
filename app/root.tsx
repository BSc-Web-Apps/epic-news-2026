import { Link, Outlet, useLoaderData } from 'react-router'
import { ParallaxProvider } from 'react-scroll-parallax'
import { type Route } from './+types/root.ts'
import { type loader } from './__root.server.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import FooterMenuRight from './components/organisms/Footer/FooterMenuRight'
import HeaderWithSearch from './components/organisms/HeaderWithSearch'
import ParallaxBackground from './components/organisms/Hero/ParallaxBackground.tsx'
import Document from './components/shared-layout/Document.tsx'
import { Button } from './components/ui/button.tsx'
import { ThemeSwitch, useTheme } from './routes/resources+/theme-switch.tsx'
import { useNonce } from './utils/nonce-provider.ts'
import rootLinkElements from './utils/providers/rootLinkElements.ts'
import heroImage from '~/assets/jpg/sample-hero.jpg'
import logo from '~/assets/svg/epic-news-sample-logo.svg'

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
		<ParallaxProvider>
			<Document theme={theme} nonce={nonce} honeyProps={data?.honeyProps}>
				<div className="flex h-screen flex-col justify-between">
					<HeaderWithSearch />

					<div className="flex-1">
						{/* <main className="h-full">
							<ParallaxBackground
								image={heroImage}
								title="Epic News"
								logo={logo}
								altText="Welcome to Epic News, where the latest developments in tech are found."
							>
								<div className="bg-secondary/40 mx-auto flex w-fit flex-1 flex-col justify-between gap-16 px-28 py-16 backdrop-blur-sm">
									<p className="text-secondary-foreground text-center text-4xl font-extrabold">
										The latest tech news in one place
									</p>
									<div className="flex justify-center gap-8">
										<Button variant="default" size="wide">
											<Link to="/signup">Sign up</Link>
										</Button>
										<Button variant="secondary" size="wide">
											<Link to="/login">Login</Link>
										</Button>
									</div>
								</div>
							</ParallaxBackground>
						</main> */}

						<Outlet />
					</div>

					<div className="container flex justify-between pb-5">
						<ThemeSwitch userPreference={data?.requestInfo.userPrefs.theme} />
					</div>

					<FooterMenuRight />
				</div>
			</Document>
		</ParallaxProvider>
	)
}

export const ErrorBoundary = GeneralErrorBoundary
