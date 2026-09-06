import { Button } from "antd"
import { useState } from "react"
import ChildComponents from "./childComponents"

function MaycaoTonghop() {
	const [count, setCount] = useState(0)
	return (
		<div>
			<Button type="primary" onClick={() => setCount(count + 1)}>
				Click me
			</Button>
			<p>{`You clicked ${count} times`}</p>
			<h2>Child Components</h2>
			<ChildComponents />
		</div>
	)
}

export default MaycaoTonghop
