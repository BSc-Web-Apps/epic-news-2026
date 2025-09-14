import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/articles.new.ts'
import { ArticleEditor } from './__article-editor.tsx'

export { action } from './__article-editor.server.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserId(request)
	return {}
}

export default ArticleEditor
