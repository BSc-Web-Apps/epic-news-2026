import { useMatches, Link } from 'react-router'
import { SearchBar } from '#app/components/search-bar.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { UserDropdown } from '#app/components/user-dropdown.tsx'
import { useOptionalUser } from '#app/utils/user.ts'
import logo from '~/assets/svg/epic-news-sample-logo.svg'

export default function HeaderWithSearch() {
	const matches = useMatches()
	const isOnSearchPage = matches.find((m) => m.id === 'routes/users+/index')
	const searchBar = isOnSearchPage ? null : <SearchBar status="idle" />
	const user = useOptionalUser()

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<div className="flex items-center gap-4">
					<img src={logo} alt="Epic News Logo" className="w-16" />
					<span className="text-foreground text-sm">Epic News</span>
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
