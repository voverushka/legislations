import {  Stack, CircularProgress } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

interface Props {
    message?: string;
}

export const AppInfo = ({message}: Props) => 
    <Stack
      sx={{
        color: "#1976d2",
        visibility: message ? "visible": "hidden",
      }}
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
        <InfoIcon fontSize="small"/>
        <p>{message}</p>
    </Stack>;

export default AppInfo;