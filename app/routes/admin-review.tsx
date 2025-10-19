import { data, NavLink, Outlet, useLoaderData } from 'react-router'
import { prisma } from '~/utils/db.server.ts'
import { cn } from '~/utils/misc.tsx'

export async function loader() {
	const allArticles = await prisma.article.findMany({
		select: { id: true, title: true, isPublished: true },
	})

	return data({ allArticles })
}

interface StatusPillProps {
	isPublished: boolean
}
export function StatusPill({ isPublished }: StatusPillProps) {
	return (
		<div
			className={`rounded-full px-2 py-1 text-xs font-semibold ${isPublished ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}
		>
			{isPublished ? 'P' : 'D'}
		</div>
	)
}

export default function ArticlesRoute() {
	const { allArticles } = useLoaderData<typeof loader>()

	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl'
	return (
		<main className="container flex h-full min-h-[750px] px-0 py-12 md:px-8">
			<div className="bg-muted grid w-full grid-cols-4 pl-2 md:container md:rounded-3xl md:pr-0">
				<div className="relative col-span-1">
					<div className="absolute inset-0 flex flex-col">
						<ul className="overflow-x-hidden overflow-y-auto py-12">
							{allArticles.map((article) => (
								<li
									key={article.id}
									className="flex items-center gap-2 p-1 pr-0"
								>
									<StatusPill isPublished={article.isPublished} />
									<NavLink
										to={article.id}
										preventScrollReset
										prefetch="intent"
										className={({ isActive }) =>
											cn(
												navLinkDefaultClassName,
												isActive && 'bg-accent w-full',
											)
										}
									>
										{article.title}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="bg-accent relative col-span-3 md:rounded-r-3xl">
					<Outlet />
				</div>
			</div>
		</main>
	)
}
