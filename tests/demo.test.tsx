import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

import App from "./Demo";

describe("app", () => {
	it("renders learn react link", () => {
		render(<App />);
		const linkElement = screen.getByText(/learn react/i);
		expect(linkElement).toBeInTheDocument();
	});
});
