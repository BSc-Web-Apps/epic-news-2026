import * as RadioGroup from '@radix-ui/react-radio-group'
import { useState } from 'react'

interface SelectorGroupProps {
	options: { value: string; label: string }[]
	name: string
	initialValue?: string
}

export default function SelectorGroup({
	options,
	name,
	initialValue,
}: SelectorGroupProps) {
	let [selectedValue, setSelectedValue] = useState(initialValue ?? '')

	return (
		<>
			<RadioGroup.Root
				className="space-y-4"
				value={selectedValue}
				onValueChange={setSelectedValue}
			>
				{options.map((option) => (
					<RadioGroup.Item
						className={`flex w-full rounded-md border p-4 ${
							option.value === selectedValue
								? 'border-sky-500 ring-1 ring-sky-500 ring-inset'
								: 'border-gray-500'
						}`}
						key={option.value}
						value={option.value}
					>
						<span className="font-semibold">{option.label}</span>
					</RadioGroup.Item>
				))}
			</RadioGroup.Root>
			{/* Single hidden input outside the radio group to submit the selected value */}
			<input type="hidden" name={name} value={selectedValue} />
		</>
	)
}
