import appleTouchIconAssetUrl from '#app/assets/favicons/apple-touch-icon.png'
import faviconAssetUrl from '#app/assets/favicons/favicon.svg'
import { href as iconsHref } from '#app/components/ui/icon.tsx'
import tailwindStyleSheetUrl from '#app/styles/tailwind.css?url'

export default [
	// Preload svg sprite as a resource to avoid render blocking
	{ rel: 'preload', href: iconsHref, as: 'image' },
	{
		rel: 'icon',
		href: '/favicon.ico',
		sizes: '48x48',
	},
	{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
	{ rel: 'apple-touch-icon', href: appleTouchIconAssetUrl },
	{
		rel: 'manifest',
		href: '/site.webmanifest',
		crossOrigin: 'use-credentials',
	} as const, // necessary to make typescript happy
	{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
].filter(Boolean)
