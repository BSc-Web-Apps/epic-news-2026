import { invariant } from '@epic-web/invariant'
import { type LoaderFunctionArgs, data, useLoaderData } from 'react-router'
import ArticleCard from '#app/components/organisms/ArticleCard.tsx'
import { prisma } from '~/utils/db.server.ts'
import { toTitleCase } from '~/utils/stringUtils.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	const { category } = params

	invariant(typeof category === 'string', 'Category not found')
	const categoryTitle = toTitleCase(category)

	const allArticles = await prisma.article.findMany({
		select: {
			id: true,
			title: true,
			category: { select: { name: true } },
			images: { select: { objectKey: true } },
		},
	})

	return data({ categoryTitle, allArticles })
}

export default function NewsCategoryPage() {
	const { categoryTitle, allArticles } = useLoaderData<typeof loader>()

	return (
		<div className="container py-16">
			<h2 className="text-h2">{categoryTitle}</h2>
			<div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
				{allArticles.map((article) => (
					<ArticleCard
						key={article.id}
						title={article.title}
						category={article.category?.name}
						objectKey={article.images[0]?.objectKey}
					/>
				))}
			</div>
		</div>
	)
}
