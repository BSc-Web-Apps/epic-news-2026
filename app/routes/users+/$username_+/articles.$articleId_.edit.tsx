import { invariantResponse } from '@epic-web/invariant'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/articles.$articleId_.edit.ts'
import { ArticleEditor } from './__article-editor.tsx'

export { action } from './__article-editor.server.tsx'

export async function loader({ params, request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const article = await prisma.article.findFirst({
		select: {
			id: true,
			title: true,
			content: true,
			images: {
				select: {
					id: true,
					altText: true,
					objectKey: true,
				},
			},
		},
		where: {
			id: params.articleId,
			ownerId: userId,
		},
	})
	invariantResponse(article, 'Not found', { status: 404 })
	return { article }
}

export default function ArticleEdit({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return <ArticleEditor article={loaderData.article} actionData={actionData} />
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No article with the id "{params.articleId}" exists</p>
				),
			}}
		/>
	)
}
