import { type Route } from './+types/articles.index.ts'
import { type Route as ArticlesRoute } from './+types/articles.ts'

export default function ArticlesIndexRoute() {
	return (
		<div className="container pt-12">
			<p className="text-body-md">Select a article</p>
		</div>
	)
}

export const meta: Route.MetaFunction = ({ params, matches }) => {
	const articlesMatch = matches.find(
		(m) => m?.id === 'routes/users+/$username_+/articles',
	) as { data: ArticlesRoute.ComponentProps['loaderData'] }

	const displayName = articlesMatch?.data?.owner.name ?? params.username
	const articleCount = articlesMatch?.data?.owner.articles.length ?? 0
	const articlesText = articleCount === 1 ? 'article' : 'articles'
	return [
		{ title: `${displayName}'s Articles | Epic Articles` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${articleCount} ${articlesText} on Epic Articles`,
		},
	]
}
