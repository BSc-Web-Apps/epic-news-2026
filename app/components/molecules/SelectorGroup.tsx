import * as RadioGroup from '@radix-ui/react-radio-group'
import { useState } from 'react'

interface SelectorGroupProps {
	options: { value: string; label: string }[]
}

export default function SelectorGroup({ options }: SelectorGroupProps) {
	let [selectedValue, setSelectedValue] = useState(options[0].value)

	return (
		<RadioGroup.Root className="space-y-4">
			{options.map(option => (
				<RadioGroup.Item
					className={`flex w-full rounded-md border p-4 ${
						option.value === selectedValue
							? 'border-sky-500 ring-1 ring-inset ring-sky-500'
							: 'border-gray-500'
					}`}
					key={option.value}
					type="button"
					onClick={() => setSelectedValue(option.value)}
					value={selectedValue}
				>
					<span className="font-semibold">{option.label}</span>
				</RadioGroup.Item>
			))}
		</RadioGroup.Root>
	)
}
