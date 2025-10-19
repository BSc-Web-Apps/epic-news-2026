import { type JSX } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import {
	MdOutlineBusinessCenter,
	MdOutlineTheaters,
	MdOutlineDesktopMac,
	MdOutlineNewspaper,
} from 'react-icons/md'
import { Link } from 'react-router'
import { toTitleCase } from '#app/utils/stringUtils.js'
import siteLogo from '~/assets/svg/epic-news-sample-logo.svg'
import { getArticleImgSrc } from '~/utils/misc.js'

interface SingleArticleProps {
	article: {
		id: string
		title: string
		content: string
		owner: {
			name: string | null
		}
		category: {
			name: string
		} | null
		images: {
			objectKey: string
		}[]
	}
}
export default function SingleArticle({ article }: SingleArticleProps) {
	const mainImage = article.images[0]

	const imageSrc = mainImage ? getArticleImgSrc(mainImage.objectKey) : siteLogo
	const categoryTitle = toTitleCase(article.category?.name || '')

	const categoryIcons: { [key: string]: JSX.Element } = {
		Business: <MdOutlineBusinessCenter size={20} className="text-violet-300" />,
		Entertainment: <MdOutlineTheaters size={20} className="text-violet-300" />,
		Technology: <MdOutlineDesktopMac size={20} className="text-violet-300" />,
		'General news': (
			<MdOutlineNewspaper size={20} className="text-violet-300" />
		),
	}

	return (
		<div className="container py-16">
			<div className="lg:w-2/3">
				<Link
					to="/news"
					className="group text-muted-foreground hover:text-foreground flex items-center gap-2 pb-4 transition"
				>
					<FiArrowLeft className="transition group-hover:-translate-x-1" /> Back
					to News
				</Link>
				<h2 className="text-h2 pb-8">{article.title}</h2>

				<div
					className={`relative h-[18rem] object-cover md:h-[23rem] lg:h-[28rem]`}
				>
					<div className="absolute inset-0">
						<img
							className="h-full w-full rounded-t-lg object-cover"
							src={imageSrc}
							alt={article.title}
						/>
					</div>
				</div>
				<div className="flex justify-between gap-4 pt-4">
					<div className="flex items-center gap-2">
						{categoryIcons[categoryTitle]}
						<p className="text-sm text-violet-300">{categoryTitle}</p>
					</div>
					<span className="text-muted-foreground text-sm">
						By: {article.owner.name}
					</span>
				</div>
				<div className="pt-16 text-lg leading-loose whitespace-break-spaces">
					{article.content}
				</div>
			</div>
		</div>
	)
}
