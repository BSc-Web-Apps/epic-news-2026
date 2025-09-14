import { faker } from '@faker-js/faker'
import { type ArticleImage, type Article } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import { expect, test } from '#tests/playwright-utils.ts'

test('Users can create article with an image', async ({
	page,
	navigate,
	login,
}) => {
	const user = await login()
	await navigate('/users/:username/articles', { username: user.username })

	const newArticle = createArticle()
	const altText = 'cute koala'
	await page.getByRole('link', { name: 'new article' }).click()

	// fill in form and submit
	await page.getByRole('textbox', { name: 'title' }).fill(newArticle.title)
	await page.getByRole('textbox', { name: 'content' }).fill(newArticle.content)
	await page
		.getByLabel('image')
		.nth(0)
		.setInputFiles('tests/fixtures/images/kody-articles/cute-koala.png')
	await page.getByRole('textbox', { name: 'alt text' }).fill(altText)

	await page.getByRole('button', { name: 'submit' }).click()
	await expect(page).toHaveURL(
		new RegExp(`/users/${user.username}/articles/.*`),
	)
	await expect(
		page.getByRole('heading', { name: newArticle.title }),
	).toBeVisible()
	await expect(
		page.getByRole('region', { name: newArticle.title }).getByAltText(altText),
	).toBeVisible()
})

test('Users can create article with multiple images', async ({
	page,
	navigate,
	login,
}) => {
	const user = await login()
	await navigate('/users/:username/articles', { username: user.username })

	const newArticle = createArticle()
	const altText1 = 'cute koala'
	const altText2 = 'koala coder'
	await page.getByRole('link', { name: 'new article' }).click()

	// fill in form and submit
	await page.getByRole('textbox', { name: 'title' }).fill(newArticle.title)
	await page.getByRole('textbox', { name: 'content' }).fill(newArticle.content)
	await page
		.getByLabel('image')
		.nth(0)
		.setInputFiles('tests/fixtures/images/kody-articles/cute-koala.png')
	await page.getByLabel('alt text').nth(0).fill(altText1)
	await page.getByRole('button', { name: 'add image' }).click()

	await page
		.getByLabel('image')
		.nth(1)
		.setInputFiles('tests/fixtures/images/kody-articles/koala-coder.png')
	await page.getByLabel('alt text').nth(1).fill(altText2)

	await page.getByRole('button', { name: 'submit' }).click()
	await expect(page).toHaveURL(
		new RegExp(`/users/${user.username}/articles/.*`),
	)
	await expect(
		page.getByRole('heading', { name: newArticle.title }),
	).toBeVisible()
	await expect(page.getByAltText(altText1)).toBeVisible()
	await expect(page.getByAltText(altText2)).toBeVisible()
})

test('Users can edit article image', async ({ page, navigate, login }) => {
	const user = await login()

	const article = await prisma.article.create({
		select: { id: true },
		data: {
			...createArticleWithImage(),
			ownerId: user.id,
		},
	})
	await navigate('/users/:username/articles/:articleId', {
		username: user.username,
		articleId: article.id,
	})

	// edit the image
	await page.getByRole('link', { name: 'Edit', exact: true }).click()
	const updatedImage = {
		altText: 'koala coder',
		location: 'tests/fixtures/images/kody-articles/koala-coder.png',
	}
	await page.getByLabel('image').nth(0).setInputFiles(updatedImage.location)
	await page.getByLabel('alt text').nth(0).fill(updatedImage.altText)
	await page.getByRole('button', { name: 'submit' }).click()

	await expect(page).toHaveURL(`/users/${user.username}/articles/${article.id}`)
	await expect(page.getByAltText(updatedImage.altText)).toBeVisible()
})

test('Users can delete article image', async ({ page, navigate, login }) => {
	const user = await login()

	const article = await prisma.article.create({
		select: { id: true, title: true },
		data: {
			...createArticleWithImage(),
			ownerId: user.id,
		},
	})
	await navigate('/users/:username/articles/:articleId', {
		username: user.username,
		articleId: article.id,
	})

	await expect(page.getByRole('heading', { name: article.title })).toBeVisible()
	const images = page
		.getByRole('region', { name: article.title })
		.getByRole('list')
		.getByRole('listitem')
		.getByRole('img')
	await expect(images).toHaveCount(1)
	await page.getByRole('link', { name: 'Edit', exact: true }).click()
	await page.getByRole('button', { name: 'remove image' }).click()
	await page.getByRole('button', { name: 'submit' }).click()
	await expect(page).toHaveURL(`/users/${user.username}/articles/${article.id}`)
	await expect(images).toHaveCount(0)
})

function createArticle() {
	return {
		title: faker.lorem.words(3),
		content: faker.lorem.paragraphs(3),
	} satisfies Omit<
		Article,
		'id' | 'createdAt' | 'updatedAt' | 'type' | 'ownerId'
	>
}

function createArticleWithImage() {
	return {
		...createArticle(),
		images: {
			create: {
				altText: 'cute koala',
				objectKey: 'kody-articles/cute-koala.png',
			},
		},
	} satisfies Omit<
		Article,
		'id' | 'createdAt' | 'updatedAt' | 'type' | 'ownerId'
	> & {
		images: {
			create: Pick<ArticleImage, 'altText' | 'objectKey'>
		}
	}
}
