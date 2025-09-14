import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser'
import { createId as cuid } from '@paralleldrive/cuid2'
import { data, redirect, type ActionFunctionArgs } from 'react-router'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { uploadArticleImage } from '#app/utils/storage.server.ts'
import {
	MAX_UPLOAD_SIZE,
	ArticleEditorSchema,
	type ImageFieldset,
} from './__article-editor'

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: string } {
	return Boolean(image.id)
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await parseFormData(request, {
		maxFileSize: MAX_UPLOAD_SIZE,
	})

	const submission = await parseWithZod(formData, {
		schema: ArticleEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const article = await prisma.article.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!article) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Article not found',
				})
			}
		}).transform(async ({ images = [], ...data }) => {
			const articleId = data.id ?? cuid()
			return {
				...data,
				id: articleId,
				imageUpdates: await Promise.all(
					images.filter(imageHasId).map(async (i) => {
						if (imageHasFile(i)) {
							return {
								id: i.id,
								altText: i.altText,
								objectKey: await uploadArticleImage(userId, articleId, i.file),
							}
						} else {
							return {
								id: i.id,
								altText: i.altText,
							}
						}
					}),
				),
				newImages: await Promise.all(
					images
						.filter(imageHasFile)
						.filter((i) => !i.id)
						.map(async (image) => {
							return {
								altText: image.altText,
								objectKey: await uploadArticleImage(
									userId,
									articleId,
									image.file,
								),
							}
						}),
				),
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const {
		id: articleId,
		title,
		content,
		imageUpdates = [],
		newImages = [],
	} = submission.value

	const updatedArticle = await prisma.article.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: articleId },
		create: {
			id: articleId,
			ownerId: userId,
			title,
			content,
			images: { create: newImages },
		},
		update: {
			title,
			content,
			images: {
				deleteMany: { id: { notIn: imageUpdates.map((i) => i.id) } },
				updateMany: imageUpdates.map((updates) => ({
					where: { id: updates.id },
					data: {
						...updates,
						// If the image is new, we need to generate a new ID to bust the cache.
						id: updates.objectKey ? cuid() : updates.id,
					},
				})),
				create: newImages,
			},
		},
	})

	return redirect(
		`/users/${updatedArticle.owner.username}/articles/${updatedArticle.id}`,
	)
}
