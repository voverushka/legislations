import { render, fireEvent, screen, within } from "@testing-library/react";
import { Component } from "react";


describe("<Component />", () => {
	test("Rendering with default props", () => {
		render(<Component />);

		// Find Input Component
		screen.getByTestId("tags-input");
		screen.getByTestId("tag-entry");

		// no tags
		expect(
			document.querySelector(`[data-selector^="Tag.Styled.Tag."]`)
		).toBeFalsy();
	});

	test("component actions", () => {
		const utils = render(<Component value={[]} />);

		// no tags initially
		let tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);
		expect(tags.length).toEqual(0);

		let input = utils.getByTestId("tag-entry");
		fireEvent.change(input, { target: { value: "  prod" } });

		// enter tag 'prod'
		expect(input).toHaveValue("  prod");
		fireEvent.keyDown(input, { key: Key.Enter, code: "Enter", charCode: 13 });
		expect(input).toHaveValue("");

		// enter tag 'dev '
		fireEvent.change(input, { target: { value: "dev  " } });
		expect(input).toHaveValue("dev  ");

		fireEvent.keyDown(input, { key: Key.Enter, code: "Enter", charCode: 13 });

		// 2 tags should be there
		tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);
		expect(tags.length).toEqual(2);

		// texts what we entered, became tags, spaces are trimmed
		within(tags[0] as HTMLElement).getByText("prod");
		within(tags[1] as HTMLElement).getByText("dev");

		// remove 1st tags by clicking tag clos button
		const closeButtons = document.querySelectorAll(
			`[data-emerald-icon^="app.close"]`
		);
		fireEvent.click(closeButtons[0]);
		tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);
		expect(tags.length).toEqual(1);

		// remove 2nd tag by pressing backspace
		fireEvent.keyDown(input, {
			key: Key.Backspace,
			code: "Backspace",
			charCode: 8,
		});
		tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);
		expect(tags.length).toEqual(0);

		// enter empty tag
		fireEvent.change(input, { target: { value: "  " } });
		expect(input).toHaveValue("  ");

		fireEvent.keyDown(input, { key: Key.Enter, code: "Enter", charCode: 13 });
		expect(tags.length).toEqual(0);
	});

	test("tags in edit", () => {
		const utils = render(<Component value={["dev", "prod"]} />);

		// no tags initially
		let tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);
		expect(tags.length).toEqual(2);

		let input = utils.getByTestId("tag-entry");
		fireEvent.change(input, { target: { value: "staging" } });

		fireEvent.keyDown(input, { key: Key.Enter, code: "Enter", charCode: 13 });
		tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);

		expect(tags.length).toEqual(3);

		// remove 1st tags by clicking tag close button
		const closeButtons = document.querySelectorAll(
			`[data-emerald-icon^="app.close"]`
		);
		fireEvent.click(closeButtons[1]);
		tags = document.querySelectorAll(`[data-selector^="Tag.Styled.Tag."]`);
		expect(tags.length).toEqual(2);

		// texts what we entered, became tags, spaces are trimmed
		within(tags[0] as HTMLElement).getByText("dev");
		within(tags[1] as HTMLElement).getByText("staging");
	});
});
