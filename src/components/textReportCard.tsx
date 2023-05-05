import React, {useContext} from 'react';
import Card from '@mui/joy/Card';
import {ITextReport} from '../types/textReport';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import {Edit, Delete, ReadMore, OpenInFull} from '@mui/icons-material';
import {checkUserRole} from '../utils/checkUserRole';
import {Context} from '../App';
import {DELETE_TEXT_REPORT, GET_PROJECT_BY_ID} from '../graphql/graphql';
import {useProjectByIdQuery} from '../graphql/useRequest';
import {useMutation} from '@apollo/react-hooks';

type Props = {
  textReport: ITextReport;
  perms: boolean;
};

const TextReportCard: React.FC<Props> = ({textReport, perms}) => {
  const [open, setOpen] = React.useState(false);
  const [openFull, setOpenFull] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [removeTextReport] = useMutation(DELETE_TEXT_REPORT, {
    variables: {
      id: textReport.id,
    },
    onCompleted: (data) => {},
  });

  const date = new Date(textReport.posted_at);
  const dateStr = date.toLocaleDateString();
 
  return (
    <Card
      orientation="horizontal"
      variant="outlined"
      sx={{
        bgcolor: 'background.body',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '50px',
        marginBottom: '5px',
        marginTop: '5px',
      }}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete text report?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this text report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              removeTextReport();
              handleClose();
              window.location.reload();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openFull}
        onClose={() => {
          setOpenFull(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{textReport.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {textReport.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenFull(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{width: '15%'}}>
        <Typography
          fontWeight="md"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {dateStr}
        </Typography>
      </Box>
      <Box sx={{width: '20%'}}>
        <Typography
          fontWeight="md"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {textReport.employee.full_name}
        </Typography>
      </Box>
      <Box sx={{width: '20%'}}>
        <Typography
          fontWeight="md"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {textReport.title}
        </Typography>
      </Box>

      <div style={{justifyContent: 'end'}}>
        <IconButton
          onClick={() => {
            setOpenFull(true);
          }}
        >
          <OpenInFull fontSize="small" />
        </IconButton>
        {perms ? (
          <IconButton
            onClick={() => {
              handleClickOpen();
            }}
          >
            <Delete />
          </IconButton>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};

export default TextReportCard;
