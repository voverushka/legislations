import { useState, useCallback, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FavouritesList from './FavouritesList';
import FullList from './FullList';
import { LegislationsService } from '../api-client';
import { useAppSelector, useAppDispatch } from '../appStore/hooks';
import {
  enableFiltering,
  filterOnSelector,
  infoMessageSelector,
  setInfo
} from '../appStore/global/globalState';

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
          {children}
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
  const [tabNumber, setTabNumber] = useState(0);
  const dispatch = useAppDispatch();
  const filteringOn = useAppSelector(filterOnSelector);
  const infoMessage =  useAppSelector(infoMessageSelector);

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabNumber(newValue);
  }, []);

  useEffect(() => {
      dispatch(setInfo("Enabling filtering..."))
      LegislationsService.prefetch().then(() => {
        dispatch(enableFiltering());
        dispatch(setInfo(undefined));
      }).catch(e => {
        dispatch(setInfo("Filtering could not be enabled."))
      });
  }, []);

  return (
    <Stack>
      <Stack>
        <h1 data-testid="header" 
          style={{ textAlign: "center", paddingTop: "15px"}}>Bills</h1>
        { infoMessage && <h4 style={{  textAlign: "center", color: "green"}}>{infoMessage}</h4>}
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabNumber} onChange={handleChange} aria-label="bill details tabs">
            <Tab label="All" {...idProps(0)} />
            { filteringOn && <Tab label="Favourites" {...idProps(1)} />}
          </Tabs>
        </Box>
        <CustomTabPanel tabNumber={tabNumber} index={0}>
          <FullList/>
        </CustomTabPanel>
        { filteringOn && <CustomTabPanel tabNumber={tabNumber} index={1}>
          <FavouritesList/>
        </CustomTabPanel>}
      </Box>
    </Stack>
  );
}


export default AppTabsContent;