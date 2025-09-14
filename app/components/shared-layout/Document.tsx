import { Meta, Links, ScrollRestoration, Scripts } from 'react-router'
import { ClientHintCheck } from '#app/utils/client-hints'
import { type Theme } from '#app/utils/theme.server'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { OpenImgContextProvider } from 'openimg/react'
import { getImgSrc } from '#app/utils/misc.tsx'

export default function Document({
	children,
	honeyProps,
	nonce,
	theme = 'dark',
	env = {},
}: {
	children: React.ReactNode
	nonce: string
	honeyProps:
		| {
				nameFieldName: string
				validFromFieldName: string | null
				encryptedValidFrom: string
		  }
		| undefined
	theme?: Theme
	env?: Record<string, string | undefined>
}) {
	const allowIndexing = ENV.ALLOW_INDEXING !== 'false'
	return (
		<HoneypotProvider {...honeyProps}>
			<OpenImgContextProvider
				optimizerEndpoint="/resources/images"
				getSrc={getImgSrc}
			>
				<html lang="en" className={`${theme} h-full overflow-x-hidden`}>
					<head>
						<ClientHintCheck nonce={nonce} />
						<Meta />
						<meta charSet="utf-8" />
						<meta
							name="viewport"
							content="width=device-width,initial-scale=1"
						/>
						{allowIndexing ? null : (
							<meta name="robots" content="noindex, nofollow" />
						)}
						<Links />
					</head>
					<body className="bg-background text-foreground">
						{children}
						<script
							nonce={nonce}
							dangerouslySetInnerHTML={{
								__html: `window.ENV = ${JSON.stringify(env)}`,
							}}
						/>
						<ScrollRestoration nonce={nonce} />
						<Scripts nonce={nonce} />
					</body>
				</html>
			</OpenImgContextProvider>
		</HoneypotProvider>
	)
}
