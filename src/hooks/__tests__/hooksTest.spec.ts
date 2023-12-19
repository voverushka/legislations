// /**
//  * @license
//  * Copyright 2022, F5 Networks, Inc.
//  * All rights reserved.
//  *
//  * No part of the software may be reproduced or transmitted in any
//  * form or by any means, electronic or mechanical, for any purpose,
//  * without express written permission of F5 Networks, Inc.
//  */
// import { act, render, cleanup } from "@testing-library/react";
// import React, { useEffect } from "react";

// import { useInterval } from "../useInterval";

// describe("useInterval", () => {
// 	beforeEach(() => {
// 		jest.useFakeTimers();
// 	});
// 	afterEach(() => {
// 		cleanup();
// 		jest.clearAllMocks();
// 	});

// 	test("setInterval called in schedule method", async () => {
// 		jest.spyOn(global, "setInterval");
// 		jest.spyOn(global, "clearInterval");

// 		const MockComponent = () => {
// 			const polling = useInterval();
// 			useEffect(() => {
// 				polling.schedule(() => {});
// 			}, []);
// 			return <div />;
// 		};

// 		await act(async () => {
// 			render(<MockComponent />);
// 		});

// 		jest.runOnlyPendingTimers();

// 		expect(setInterval).toBeCalledTimes(1);
// 		expect(clearInterval).toBeCalledTimes(0);
// 	});

// 	test("clearInterval called on clear", async () => {
// 		jest.spyOn(global, "setInterval");
// 		jest.spyOn(global, "clearInterval");

// 		const MockComponent = () => {
// 			const polling = useInterval();
// 			useEffect(() => {
// 				polling.schedule(() => {});
// 				polling.clear();
// 			}, []);
// 			return <div />;
// 		};

// 		await act(async () => {
// 			render(<MockComponent />);
// 		});

// 		jest.runOnlyPendingTimers();
// 		expect(setInterval).toBeCalledTimes(1);
// 		expect(clearInterval).toBeCalledTimes(1);
// 	});

// 	test("clearInterval called on page unmount", async () => {
// 		jest.spyOn(global, "setInterval");
// 		jest.spyOn(global, "clearInterval");

// 		const MockComponent = () => {
// 			const polling = useInterval();
// 			useEffect(() => {
// 				polling.schedule(() => {});
// 				polling.clear();
// 			}, []);
// 			return <div />;
// 		};

// 		await act(async () => {
// 			render(<MockComponent />);
// 		});

// 		jest.runOnlyPendingTimers();
// 		expect(setInterval).toBeCalledTimes(1);
// 		expect(clearInterval).toBeCalledTimes(1);
// 	});

// 	test("interval call does not happen if pause is in effect", async () => {
// 		jest.spyOn(global, "setInterval");
// 		jest.spyOn(global, "clearInterval");

// 		const intervalCallback = jest.fn();

// 		const MockComponent = () => {
// 			const polling = useInterval();
// 			useEffect(() => {
// 				polling.schedule(intervalCallback);
// 				polling.pause();
// 			}, []);
// 			return <div />;
// 		};

// 		await act(async () => {
// 			render(<MockComponent />);
// 		});

// 		jest.runOnlyPendingTimers();
// 		expect(setInterval).toBeCalledTimes(1);
// 		expect(intervalCallback).toBeCalledTimes(0);
// 		expect(clearInterval).toBeCalledTimes(0);
// 	});
// });
