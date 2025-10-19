import { data, LoaderFunctionArgs, useLoaderData } from 'react-router'

export async function loader({ params }: LoaderFunctionArgs) {
	const { articleId } = params

	return data({ articleId })
}

export default function ArticleRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<main className="container py-16">
			<h1 className="text-h1">Article {data.articleId}</h1>
		</main>
	)
}
