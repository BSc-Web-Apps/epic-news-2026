import { data } from 'react-router'
import { type Route } from './+types/root.ts'
import { getUserId, logout } from './utils/auth.server.ts'
import { getHints } from './utils/client-hints'
import { prisma } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { pipeHeaders } from './utils/headers.server.ts'
import { honeypot } from './utils/honeypot.server.ts'
import { getDomainUrl, combineHeaders } from './utils/misc.tsx'
import { getTheme } from './utils/theme.server'
import { makeTimings, time } from './utils/timing.server'
import { getToast } from './utils/toast.server.ts'
import { csrf } from './utils/csrf.server.ts'

export const headers: Route.HeadersFunction = pipeHeaders

export async function loader({ request }: Route.LoaderArgs) {
	const timings = makeTimings('root loader')
	const userId = await time(() => getUserId(request), {
		timings,
		type: 'getUserId',
		desc: 'getUserId in root',
	})

	const user = userId
		? await time(
				() =>
					prisma.user.findUnique({
						select: {
							id: true,
							name: true,
							username: true,
							image: { select: { objectKey: true } },
							roles: {
								select: {
									name: true,
									permissions: {
										select: { entity: true, action: true, access: true },
									},
								},
							},
						},
						where: { id: userId },
					}),
				{ timings, type: 'find user', desc: 'find user in root' },
			)
		: null
	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await logout({ request, redirectTo: '/' })
	}
	const { toast, headers: toastHeaders } = await getToast(request)
	const honeyProps = await honeypot.getInputProps()
	let [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)

	return data(
		{
			user,
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userPrefs: {
					theme: getTheme(request),
				},
			},
			ENV: getEnv(),
			toast,
			honeyProps,
			csrfToken,
		},
		{
			headers: combineHeaders(
				{ 'set-cookie': csrfCookieHeader || '' },
				{ 'Server-Timing': timings.toString() },
				toastHeaders,
			),
		},
	)
}
