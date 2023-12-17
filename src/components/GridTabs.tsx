import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SelectedRow } from "../shared/types";
import List from "./List";
import { LegislationsService } from '../services';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  tabNumber: number;
}

const tabName = "main-grid";

function CustomTabPanel(props: TabPanelProps) {
  const { children, tabNumber, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabNumber !== index}
      id={`${tabName}-${index}`}
      aria-labelledby={`${tabName}-tab-${index}`}
      {...other}
    >
      {tabNumber === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function idProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `${tabName}-tabpanel-${index}`,
  };
}

export const AppTabsContent = () => {
  const [tabNumber, setTabNumber] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  };

  // TODO: could do loops if to make it generic
  // { label, content}

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabNumber} onChange={handleChange} aria-label="bill details tabs">
          <Tab label="All" {...idProps(0)} />
          <Tab label="Favourites" {...idProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel tabNumber={tabNumber} index={0}>
        <List ItemsService={LegislationsService.getLegislations}/>
      </CustomTabPanel>
      <CustomTabPanel tabNumber={tabNumber} index={1}>
        <List ItemsService={LegislationsService.getFavouriteLegislations}/>
      </CustomTabPanel>
    </Box>
  );
}


export default AppTabsContent;