import { Link, type MetaFunction } from 'react-router'
import ParallaxBackground from '#app/components/organisms/Hero/ParallaxBackground.tsx'
import { Button } from '#app/components/ui/button.tsx'
import heroImage from '~/assets/jpg/sample-hero.jpg'
import logo from '~/assets/svg/epic-news-sample-logo.svg'

export const meta: MetaFunction = () => [{ title: 'Epic News' }]

export default function Index() {
	return (
		<main className="h-full">
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
		</main>
	)
}
