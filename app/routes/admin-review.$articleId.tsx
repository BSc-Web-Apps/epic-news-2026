import { getFormProps, useForm } from '@conform-to/react'
import { Form, useActionData, useLoaderData } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { type action, type loader } from './__admin-review.$articleId.server'
import { floatingToolbarClassName } from '~/components/floating-toolbar.tsx'
import { ErrorList } from '~/components/forms.tsx'
import { Icon } from '~/components/ui/icon.tsx'
import { StatusButton } from '~/components/ui/status-button.tsx'
import { getArticleImgSrc, useIsPending } from '~/utils/misc.tsx'
export { action, loader } from './__admin-review.$articleId.server'

export default function AdminReviewRoute() {
	const data = useLoaderData<typeof loader | null>()

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="text-h2 mb-2 pt-12 lg:mb-6">{data?.article.title}</h2>
			<div className="mb-4 flex justify-between gap-4">
				<p className="bg-card text-card-foreground w-fit rounded-lg px-4 py-2 text-sm">
					{data?.article.category?.name ?? 'General News'}
				</p>
				<p
					className={`w-fit rounded-lg ${data?.article.isPublished ? 'bg-green-800' : 'bg-destructive'} text-card-foreground px-4 py-2 text-xs font-bold`}
				>
					{data?.article.isPublished ? 'Published' : 'Awaiting review'}
				</p>
			</div>
			<div className="overflow-y-auto pb-24">
				<ul className="flex flex-wrap gap-5 py-5">
					{data?.article.images.map((image) => (
						<li key={image.objectKey}>
							<a href={getArticleImgSrc(image.objectKey)}>
								<img
									src={getArticleImgSrc(image.objectKey)}
									alt={image.altText ?? ''}
									className="h-32 w-32 rounded-lg object-cover"
								/>
							</a>
						</li>
					))}
				</ul>
				<p className="text-sm whitespace-break-spaces md:text-lg">
					{data?.article.content}
				</p>
			</div>

			<div className={floatingToolbarClassName}>
				<span className="text-foreground/90 text-sm max-[524px]:hidden">
					<Icon name="clock" className="scale-125">
						{data?.timeAgoUpdated} ago
					</Icon>
				</span>
				<span
					className={`text-sm ${data?.timeAgoPublished ? 'text-foreground/90' : 'text-red/90'} max-[524px]:hidden`}
				>
					<Icon
						name={data?.timeAgoPublished ? 'check' : 'update'}
						className="scale-125"
					>
						{data?.timeAgoPublished
							? `Published ${data?.timeAgoPublished} ago`
							: 'Not published yet'}
					</Icon>
				</span>
				<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
					<ArticleStatusForm
						id={data?.article.id ?? ''}
						isPublished={data?.article.isPublished ?? false}
					/>
				</div>
			</div>
		</div>
	)
}

interface PublishArticleProps {
	id: string
	isPublished: boolean
}
export function ArticleStatusForm({ id, isPublished }: PublishArticleProps) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'set-article-status',
		lastResult: actionData?.result,
	})

	return (
		<Form method="POST" {...getFormProps(form)}>
			<input
				type="hidden"
				name={isPublished ? 'unpublish' : 'publish'}
				value={id}
			/>
			<StatusButton
				type="submit"
				name="intent"
				value="set-article-status"
				status={isPending ? 'pending' : (form.status ?? 'idle')}
				disabled={isPending}
				className="w-full max-md:aspect-square max-md:px-0"
			>
				<Icon
					name={isPublished ? 'cross-1' : 'check'}
					className="scale-125 max-md:scale-150"
				>
					<span className="max-md:hidden">
						{isPublished ? 'Unpublish' : 'Publish'}
					</span>
				</Icon>
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>You are not allowed to do that</p>,
				404: () => <p>No article with the id exists</p>,
			}}
		/>
	)
}
