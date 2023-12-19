// Copyright (C) F5 Networks, Inc. 2023
// All rights reserved.
// No part of the software may be reproduced or transmitted in any
// form or by any means, electronic or mechanical, for any purpose,
// without express written permission of F5 Networks, Inc.
import "@testing-library/jest-dom";
import React from "react";
import "regenerator-runtime/runtime";

const useCanaryMock = (channel, prop) => {
	const processedCatalogMock = {
		definitions: {
			"nginx.client.latency.count": {
				displayName: "nginx.client.latency.count",
				aggregations: ["MIN", "MAX", "SUM", "AVG"],
				dimensions: [
					{
						name: "local_id",
						displayName: "local_id",
					},
					{
						name: "http.response_code",
						displayName: "http.response_code",
					},
				],
				unit: "integer",
			},
			"client.latency.max": {
				displayName: "client.latency.max",
				aggregations: ["MIN", "MAX", "SUM", "AVG"],
				dimensions: [
					{
						name: "application",
						displayName: "application",
					},
					{
						name: "http.response_code",
						displayName: "http.response_code",
					},
				],
				unit: "milliseconds",
			},
		},
		metrics: [
			{
				value: "nginx.client.latency.count",
				label: "nginx.client.latency.count",
			},
			{
				value: "client.latency.max",
				label: "client.latency.max",
			},
		],
	};
	if (channel === "global" && prop === "headerContent") {
		return ["headerContentMock", () => {}];
	}
	if (channel === "global" && prop === "pageTitle") {
		return ["MockPageTitle", () => {}];
	}
	if (channel === "global" && prop === "metricsCatalog") {
		return [processedCatalogMock];
	}
	return [];
};
const mockCanaryChannelsContext = React.createContext({
	global: {
		consumer: new Proxy(
			{},
			{
				get: () => {
					return {
						inspect: () => undefined,
					};
				},
			}
		),
		emitter: new Proxy(
			{},
			{
				get: () => () => {},
			}
		),
	},
});

jest.mock("@f5/nms-platform", () => ({
	__esModule: true,
	default: "mockedDefaultExport",
	useCanary: useCanaryMock,
	canaryChannelsContext: mockCanaryChannelsContext,
}));

jest.mock("@volterra/vis-react", () => ({
	__esModule: true,
	default: "mockedDefaultExport",
	VisAxis: () => <span>VisAxis</span>,
	VisBulletLegend: () => <span>VisBulletLegend</span>,
	VisCrosshair: () => <span>VisCrosshair</span>,
	VisLine: () => <span>VisLine</span>,
	VisScatter: () => <span>VisScatter</span>,
	VisTooltip: () => <span>VisTooltip</span>,
	VisXYContainer: () => <div>VisXYContainer</div>,
}));

jest.mock("react-markdown", () => props => {
	return <>{props.children}</>;
});

const resizeObserverObserve = jest.fn();
const resizeObserverUnobserve = jest.fn();
const resizeObserverDisconnect = jest.fn();

class ResizeObserver {
	public observe = resizeObserverObserve;
	public unobserve = resizeObserverUnobserve;
	public disconnect = resizeObserverDisconnect;
}

window.ResizeObserver = ResizeObserver;

const { getComputedStyle } = window;
window.getComputedStyle = elt => getComputedStyle(elt);

document.createRange = () => {
	const range = new Range();

	range.getBoundingClientRect = jest.fn();

	range.getClientRects = jest.fn(() => ({
		item: () => null,
		length: 0,
	})) as any;

	return range;
};
