import { Link, NavLink } from 'react-router'
import logo from '#app/assets/svg/icon-placeholder.svg'
import SocialMediaButtons from '#app/components/molecules/SocialMediaButtons'
import { Button } from '#app/components/ui/button.tsx'
import { type FooterProps } from './FooterBasic'

const FooterMenuRight = ({
	companyName = 'CHANGE THIS TO YOUR COMPANY NAME!',
	altText = 'Our company logo',
}: FooterProps) => {
	return (
		<footer className="bg-secondary dark:bg-dark-secondary lg:py-16">
			<div className="border-muted-foreground/75 dark:border-dark-muted-foreground/75 container items-center justify-between border-b py-8 lg:flex">
				<Link to="/" className="flex w-20 items-center justify-center lg:w-24">
					<img src={logo} alt={altText} />
				</Link>

				<div className="lg:flex">
					<div className="text-secondary-foreground dark:text-dark-secondary-foreground flex items-start gap-6 py-8 font-bold lg:mr-24">
						<div>
							<NavLink to="#">Nav Label</NavLink>
						</div>
						<div>
							<NavLink to="#">Nav Label</NavLink>
						</div>
						<div>
							<NavLink to="#">Nav Label</NavLink>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="lg:mr-4">
							<Link to="/signup">
								<Button>Sign Up</Button>
							</Link>
						</div>
						<div>
							<Link to="/login">
								<Button variant="secondary">Log In</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="container flex items-center justify-between py-8">
				<div className="text-muted-foreground/75 dark:text-dark-muted-foreground/75 text-xs">
					&copy; {companyName} | {new Date().getFullYear()}
				</div>
				<div className="flex w-20 items-center justify-center lg:w-24">
					<SocialMediaButtons />
				</div>
			</div>
		</footer>
	)
}

export default FooterMenuRight
