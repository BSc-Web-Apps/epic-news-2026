import { Link, useMatches } from 'react-router'
import { SearchBar } from '#app/components/search-bar.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { UserDropdown } from '#app/components/user-dropdown.tsx'
import { useOptionalUser, userHasRole } from '#app/utils/user.ts'
import logo from '~/assets/svg/epic-news-sample-logo.svg'

export default function HeaderWithSearch() {
	const matches = useMatches()
	const isOnSearchPage = matches.find((m) => m.id === 'routes/users+/index')
	const searchBar = isOnSearchPage ? null : <SearchBar status="idle" />
	const user = useOptionalUser()
	console.log({ user, userRoles: user?.roles })
	const isAdminUser = user ? userHasRole(user, 'admin') : false

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Link to="/" className="flex items-center gap-4">
					<div className="flex items-center gap-4">
						<img src={logo} alt="Epic News Logo" className="w-16" />
						<span className="text-foreground text-sm">Epic News</span>
					</div>
				</Link>

				<div className="flex flex-1 items-center justify-center gap-8">
					{isAdminUser && (
						<Link
							to="/admin-review"
							className="text-foreground rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold transition hover:bg-green-800"
						>
							Admin Review
						</Link>
					)}
					<Link
						to="/news"
						className="text-muted-foreground hover:text-foreground text-sm font-semibold transition"
					>
						News
					</Link>
					<Link
						to="/about-us"
						prefetch="intent"
						className="text-muted-foreground hover:text-foreground text-sm font-semibold transition"
					>
						About us
					</Link>
					<Link
						to="/contact-us"
						prefetch="intent"
						className="text-muted-foreground hover:text-foreground text-sm font-semibold transition"
					>
						Contact us
					</Link>
				</div>

				<div className="ml-auto hidden max-w-sm flex-1 sm:block">
					{searchBar}
				</div>
				<div className="flex items-center gap-10">
					{user ? (
						<UserDropdown />
					) : (
						<Button asChild variant="default" size="lg">
							<Link to="/login">Log In</Link>
						</Button>
					)}
				</div>
				<div className="block w-full sm:hidden">{searchBar}</div>
			</nav>
		</header>
	)
}
