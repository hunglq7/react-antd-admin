import { Button } from "antd"
import * as React from "react"

function fibonacci(n: number): number {
	if (n === 1) {
		return 0
	}
	if (n === 2) {
		return 1
	}
	return fibonacci(n - 1) + fibonacci(n - 2)
}

function ChildComponents() {
	console.error("ChildComponents rendered")
	const fib = fibonacci(40)

	const [count, setCount] = React.useState(0)
	return (
		<div>
			{`Fibonacci: ${fib}`}
			<Button onClick={() => setCount(count + 1)}>{`Update (${count})`}</Button>
		</div>
	)
}

export default ChildComponents
