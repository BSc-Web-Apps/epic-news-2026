import { data, LoaderFunctionArgs, useLoaderData } from 'react-router'

export async function loader({ params }: LoaderFunctionArgs) {
	const { article_id } = params

	return data({ article_id })
}

export default function ArticleRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<main className="container py-16">
			<h1 className="text-h1">Article {data.article_id}</h1>
		</main>
	)
}
