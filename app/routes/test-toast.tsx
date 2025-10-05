import { toast } from 'sonner'
import { Button } from '#app/components/ui/button.tsx'

export default function TestToast() {
	return (
		<div className="container mx-auto p-8">
			<h1 className="mb-8 text-3xl font-bold">Toast Animation Test</h1>
			<div className="space-y-4">
				<Button
					onClick={() =>
						toast.success('Success!', {
							description: 'This is a success toast with animations',
						})
					}
				>
					Show Success Toast
				</Button>
				<Button
					onClick={() =>
						toast.error('Error!', {
							description: 'This is an error toast with animations',
						})
					}
					variant="destructive"
				>
					Show Error Toast
				</Button>
				<Button
					onClick={() =>
						toast.message('Info', {
							description: 'This is an info toast with animations',
						})
					}
					variant="secondary"
				>
					Show Info Toast
				</Button>
				<Button
					onClick={() =>
						toast('Custom Toast', {
							description: 'This is a custom toast with animations',
							action: {
								label: 'Action',
								onClick: () => console.log('Action clicked'),
							},
						})
					}
					variant="outline"
				>
					Show Custom Toast
				</Button>
			</div>
			<div className="mt-8">
				<p className="text-muted-foreground">
					Click the buttons above to test toast animations. The toasts should
					slide in smoothly from the bottom-right corner and slide out when
					dismissed or after the duration expires.
				</p>
			</div>
		</div>
	)
}
