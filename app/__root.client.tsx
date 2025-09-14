import { type Route } from './+types/root.ts'

export const meta: Route.MetaFunction = ({ data }) => {
	return [
		{ title: data ? 'Epic News' : 'Error | Epic News' },
		{ name: 'description', content: `News that matters.` },
	]
}
