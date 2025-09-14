import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { formatDistanceToNow } from 'date-fns'
import { Img } from 'openimg/react'
import { useRef, useEffect } from 'react'
import { data, Form, Link } from 'react-router'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { floatingToolbarClassName } from '#app/components/floating-toolbar.tsx'
import { ErrorList } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getArticleImgSrc, useIsPending } from '#app/utils/misc.tsx'
import { requireUserWithPermission } from '#app/utils/permissions.server.ts'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { userHasPermission, useOptionalUser } from '#app/utils/user.ts'
import { type Route } from './+types/articles.$articleId.ts'
import { type Route as ArticlesRoute } from './+types/articles.ts'

export async function loader({ params }: Route.LoaderArgs) {
	const article = await prisma.article.findUnique({
		where: { id: params.articleId },
		select: {
			id: true,
			title: true,
			content: true,
			ownerId: true,
			updatedAt: true,
			images: {
				select: {
					altText: true,
					objectKey: true,
				},
			},
		},
	})

	invariantResponse(article, 'Not found', { status: 404 })

	const date = new Date(article.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return { article, timeAgo }
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-article'),
	articleId: z.string(),
})

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: DeleteFormSchema,
	})
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { articleId } = submission.value

	const article = await prisma.article.findFirst({
		select: { id: true, ownerId: true, owner: { select: { username: true } } },
		where: { id: articleId },
	})
	invariantResponse(article, 'Not found', { status: 404 })

	const isOwner = article.ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:article:own` : `delete:article:any`,
	)

	await prisma.article.delete({ where: { id: article.id } })

	return redirectWithToast(`/users/${article.owner.username}/articles`, {
		type: 'success',
		title: 'Success',
		description: 'Your article has been deleted.',
	})
}

export default function ArticleRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const user = useOptionalUser()
	const isOwner = user?.id === loaderData.article.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:article:own` : `delete:article:any`,
	)
	const displayBar = canDelete || isOwner

	// Add ref for auto-focusing
	const sectionRef = useRef<HTMLElement>(null)

	// Focus the section when the article ID changes
	useEffect(() => {
		if (sectionRef.current) {
			sectionRef.current.focus()
		}
	}, [loaderData.article.id])

	return (
		<section
			ref={sectionRef}
			className="absolute inset-0 flex flex-col px-10"
			aria-labelledby="article-title"
			tabIndex={-1} // Make the section focusable without keyboard navigation
		>
			<h2 id="article-title" className="text-h2 mb-2 pt-12 lg:mb-6">
				{loaderData.article.title}
			</h2>
			<div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
				<ul className="flex flex-wrap gap-5 py-5">
					{loaderData.article.images.map((image) => (
						<li key={image.objectKey}>
							<a href={getArticleImgSrc(image.objectKey)}>
								<Img
									src={getArticleImgSrc(image.objectKey)}
									alt={image.altText ?? ''}
									className="size-32 rounded-lg object-cover"
									width={512}
									height={512}
								/>
							</a>
						</li>
					))}
				</ul>
				<p className="text-sm whitespace-break-spaces md:text-lg">
					{loaderData.article.content}
				</p>
			</div>
			{displayBar ? (
				<div className={floatingToolbarClassName}>
					<span className="text-foreground/90 text-sm max-[524px]:hidden">
						<Icon name="clock" className="scale-125">
							{loaderData.timeAgo} ago
						</Icon>
					</span>
					<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
						{canDelete ? (
							<DeleteArticle
								id={loaderData.article.id}
								actionData={actionData}
							/>
						) : null}
						<Button
							asChild
							className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
						>
							<Link to="edit">
								<Icon name="pencil-1" className="scale-125 max-md:scale-150">
									<span className="max-md:hidden">Edit</span>
								</Icon>
							</Link>
						</Button>
					</div>
				</div>
			) : null}
		</section>
	)
}

export function DeleteArticle({
	id,
	actionData,
}: {
	id: string
	actionData: Route.ComponentProps['actionData'] | undefined
}) {
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'delete-article',
		lastResult: actionData?.result,
	})

	return (
		<Form method="POST" {...getFormProps(form)}>
			<input type="hidden" name="articleId" value={id} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-article"
				variant="destructive"
				status={isPending ? 'pending' : (form.status ?? 'idle')}
				disabled={isPending}
				className="w-full max-md:aspect-square max-md:px-0"
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Delete</span>
				</Icon>
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
	)
}

export const meta: Route.MetaFunction = ({ data, params, matches }) => {
	const articlesMatch = matches.find(
		(m) => m?.id === 'routes/users+/$username_+/articles',
	) as { data: ArticlesRoute.ComponentProps['loaderData'] } | undefined

	const displayName = articlesMatch?.data?.owner.name ?? params.username
	const articleTitle = data?.article.title ?? 'Article'
	const articleContentsSummary =
		data && data.article.content.length > 100
			? data?.article.content.slice(0, 97) + '...'
			: 'No content'
	return [
		{ title: `${articleTitle} | ${displayName}'s Articles | Epic Articles` },
		{
			name: 'description',
			content: articleContentsSummary,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No article with the id "{params.articleId}" exists</p>
				),
			}}
		/>
	)
}
