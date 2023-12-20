import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { SelectedRow } from "../shared/types";
import Content from "./Tabs";

export interface RowInfoDialogProps {
  open: boolean;
  selectedRow: SelectedRow;
  onClose: () => void;
}

const RowInfoDialog = (props: RowInfoDialogProps) => {
  const { onClose, selectedRow, open } = props;
  const { billNumber } = selectedRow;
  
  const handleClose = React.useCallback(() => {
     onClose();
  }, []);

  return (
    <Dialog 
      onClose={handleClose} 
      open={open}  
      fullWidth
      maxWidth="sm">
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

export default RowInfoDialog;
