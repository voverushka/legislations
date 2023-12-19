// Copyright (C) F5 Networks, Inc. 2023
// All rights reserved.
// No part of the software may be reproduced or transmitted in any
// form or by any means, electronic or mechanical, for any purpose,
// without express written permission of F5 Networks, Inc.
const defaultTestRegex = "(/__tests__/.*(test|spec)).(js?|jsx?|ts?|tsx?)$";
// const integrationTestRegex = "(/__tests__/.*(test|spec)).integration.(js?|jsx?|ts?|tsx?)$";
// const allTestRegex = "(/__tests__/.*(test|spec))(.integration)?.(js?|jsx?|ts?|tsx?)$";

let currentTestRegex = defaultTestRegex;
// if (process.env.RUN_TESTS === "integration") {
//     currentTestRegex = integrationTestRegex;
// }
// if (process.env.RUN_TESTS === "all") {
//     currentTestRegex = allTestRegex;
// }

module.exports = {
	testRegex: currentTestRegex,
	testEnvironment: "jest-environment-jsdom",
	rootDir: "../",
	moduleFileExtensions: ["js", "ts", "jsx", "tsx"],
	moduleDirectories: ["node_modules", "src"],
	moduleNameMapper: {
		d3: "<rootDir>/node_modules/d3/dist/d3.min.js",
		"^#api-client/(.*)$": "<rootDir>/src/api-client/generated/$1",
		"^#jest/(.*)$": "<rootDir>/jest/$1",
		"^#/(.*)$": "<rootDir>/src/$1",
		"^../core/(.*)$": [
			"../core/$1",
			"<rootDir>/src/api-client/generated/core/$1",
		],
	},
	setupFilesAfterEnv: ["<rootDir>/jest/setup.tsx"],
	maxWorkers: 4,
	testTimeout: 10000,
	collectCoverage: true,
	coverageReporters: ["json", "lcov", "cobertura", "text-summary"],
	collectCoverageFrom: ["./src/**", "!**/__tests__/**"],
	coverageDirectory: "coverage",
};
