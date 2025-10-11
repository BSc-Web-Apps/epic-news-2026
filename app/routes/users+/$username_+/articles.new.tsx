import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/articles.new.ts'
import { ArticleEditor } from './__article-editor.tsx'
import { prisma } from '~/utils/db.server.ts'
import { useLoaderData } from 'react-router'

export { action } from './__article-editor.server.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserId(request)
	const categories = await prisma.articleCategory.findMany({
		select: {
			id: true,
			name: true,
		},
	})

	return { categories }
}

export default function ArticleNew() {
	const data = useLoaderData<typeof loader | null>()

	return <ArticleEditor categories={data?.categories} />
}
