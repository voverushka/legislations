import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Box from '@mui/material/Box';
import AppTabsContent from "./components/GridTabs";


const App = () => <>
		<h1>Bills table</h1>
		<Box className="App"
			sx={{
				width: "80vw",
				height: "80vh",
			}}
		>
			<AppTabsContent/>
		</Box>
	</>
export default App;
