// Copyright (C) F5 Networks, Inc. 2023
// All rights reserved.
// No part of the software may be reproduced or transmitted in any
// form or by any means, electronic or mechanical, for any purpose,
// without express written permission of F5 Networks, Inc.
import { canaryChannelsContext } from "@f5/nms-platform";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

const AllTheProviders = ({ children }) => {
	const history = createMemoryHistory();

	return <Router history={history}>{children}</Router>;
};

const customRender = (ui, options) => {
	return render(
		<canaryChannelsContext.Provider value={{}}>
			{ui}
		</canaryChannelsContext.Provider>,
		{ wrapper: AllTheProviders, ...options }
	);
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
