import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { UniqueEnforcer } from 'enforce-unique'

const uniqueUsernameEnforcer = new UniqueEnforcer()

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.username({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')
	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

export function createPassword(password: string = faker.internet.password()) {
	return {
		hash: bcrypt.hashSync(password, 10),
	}
}

let noteImages: Array<{ altText: string; objectKey: string }> | undefined
export async function getNoteImages() {
	if (noteImages) return noteImages

	noteImages = await Promise.all([
		{
			altText: 'a nice country house',
			objectKey: 'notes/0.png',
		},
		{
			altText: 'a city scape',
			objectKey: 'notes/1.png',
		},
		{
			altText: 'a sunrise',
			objectKey: 'notes/2.png',
		},
		{
			altText: 'a group of friends',
			objectKey: 'notes/3.png',
		},
		{
			altText: 'friends being inclusive of someone who looks lonely',
			objectKey: 'notes/4.png',
		},
		{
			altText: 'an illustration of a hot air balloon',
			objectKey: 'notes/5.png',
		},
		{
			altText:
				'an office full of laptops and other office equipment that look like it was abandoned in a rush out of the building in an emergency years ago.',
			objectKey: 'notes/6.png',
		},
		{
			altText: 'a rusty lock',
			objectKey: 'notes/7.png',
		},
		{
			altText: 'something very happy in nature',
			objectKey: 'notes/8.png',
		},
		{
			altText: `someone at the end of a cry session who's starting to feel a little better.`,
			objectKey: 'notes/9.png',
		},
	])

	return noteImages
}

let userImages: Array<{ objectKey: string }> | undefined
export async function getUserImages() {
	if (userImages) return userImages

	userImages = await Promise.all(
		Array.from({ length: 10 }, (_, index) => ({
			objectKey: `user/${index}.jpg`,
		})),
	)

	return userImages
}

export const cleanupDb = async () => {
	const prisma = new PrismaClient()

	// Check if database has any existing data that needs cleanup
	const existingUserCount = await prisma.user.count()
	const existingNoteCount = await prisma.note.count()
	const existingDataExists = existingUserCount > 0 || existingNoteCount > 0

	if (!existingDataExists) {
		console.log('✨ Database is empty, skipping cleanup')
	} else {
		console.log(
			`🔍 Found existing data (${existingUserCount} users, ${existingNoteCount} notes), proceeding with cleanup`,
		)

		// Delete in order to respect foreign key constraints
		// Delete child records first, then parent records

		// Check and delete note images
		const noteImageCount = await prisma.noteImage.count()
		if (noteImageCount > 0) {
			await prisma.noteImage.deleteMany()
			console.log(`🎯 Deleted ${noteImageCount} note images`)
		}

		// Check and delete notes
		const noteCount = await prisma.note.count()
		if (noteCount > 0) {
			await prisma.note.deleteMany()
			console.log(`🎯 Deleted ${noteCount} notes`)
		}

		// Check and delete user images
		const userImageCount = await prisma.userImage.count()
		if (userImageCount > 0) {
			await prisma.userImage.deleteMany()
			console.log(`🎯 Deleted ${userImageCount} user images`)
		}

		// Check and delete passwords
		const passwordCount = await prisma.password.count()
		if (passwordCount > 0) {
			await prisma.password.deleteMany()
			console.log(`🎯 Deleted ${passwordCount} passwords`)
		}

		// Check and delete sessions
		const sessionCount = await prisma.session.count()
		if (sessionCount > 0) {
			await prisma.session.deleteMany()
			console.log(`🎯 Deleted ${sessionCount} sessions`)
		}

		// Check and delete connections
		const connectionCount = await prisma.connection.count()
		if (connectionCount > 0) {
			await prisma.connection.deleteMany()
			console.log(`🎯 Deleted ${connectionCount} connections`)
		}

		// Check and delete passkeys
		const passkeyCount = await prisma.passkey.count()
		if (passkeyCount > 0) {
			await prisma.passkey.deleteMany()
			console.log(`🎯 Deleted ${passkeyCount} passkeys`)
		}

		// Check and delete verifications
		const verificationCount = await prisma.verification.count()
		if (verificationCount > 0) {
			await prisma.verification.deleteMany()
			console.log(`🎯 Deleted ${verificationCount} verifications`)
		}

		// Delete user-role relationships but preserve roles and permissions
		// Use a try-catch for raw SQL in case the table doesn't exist or is empty
		try {
			const userRoleResult = await prisma.$executeRaw`DELETE FROM "_RoleToUser"`
			if (userRoleResult > 0) {
				console.log(`🎯 Deleted ${userRoleResult} user-role relationships`)
			}
		} catch {
			// Table might not exist or be empty, which is fine
			console.log('ℹ️ No user-role relationships to delete')
		}

		// Delete users (this will cascade to related records due to foreign key constraints)
		const deletedUsers = await prisma.user.deleteMany()
		console.log(`🎯 Deleted ${deletedUsers.count} users`)
	}
}
