import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { SelectedRow } from "../shared/types";
import Content from "./Tabs";


export interface SimpleDialogProps {
  open: boolean;
  selectedRow: SelectedRow;
  onClose: () => void;
}

const SimpleDialog = (props: SimpleDialogProps) => {
  const { onClose, selectedRow, open } = props;
  const {  billNumber, titleEn, titleGa } = selectedRow;
  
  const handleClose = () => {
     onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Title of Bill <strong>{`${billNumber}`}</strong></DialogTitle>
      <DialogContent>
          <Content {...selectedRow} />
      </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>Close</Button>
    </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
