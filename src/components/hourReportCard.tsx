import React, {useContext} from 'react';
import {IHourReport} from '../types/hourReport';
import Card from '@mui/joy/Card';
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
import {Edit, Delete, OpenInFull} from '@mui/icons-material';
import {
  DELETE_HOUR_REPORT,
  GET_HOUR_REPORTS_BY_PROJECT,
  GET_PROJECT_BY_ID,
} from '../graphql/graphql';
import {useMutation} from '@apollo/react-hooks';
import {checkUserRole} from '../utils/checkUserRole';
import {useProjectByIdQuery} from '../graphql/useRequest';
import {Context} from '../App';

type Props = {
  hourReport: IHourReport;
  perms: boolean;
};

const HourReportCard: React.FC<Props> = ({hourReport, perms}) => {
  const [open, setOpen] = React.useState(false);
  const [openFull, setOpenFull] = React.useState(false);

  const date = new Date(hourReport.posted_at);
  const dateStr = date.toLocaleDateString();

  const [removeHourReport] = useMutation(DELETE_HOUR_REPORT, {
    variables: {
      id: hourReport.id,
    },
    refetchQueries: [
      {
        query: GET_HOUR_REPORTS_BY_PROJECT,
        variables: {projectId: hourReport.project},
      },
    ],
    onCompleted: (data) => {},
  });
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
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete hour report?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this hour report?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
          }}>Cancel</Button>
          <Button
            onClick={() => {
              removeHourReport();
              setOpen(false);
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
        <DialogTitle id="alert-dialog-title">Hour report by {hourReport.employee.full_name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Task: {hourReport.task}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Work time: {hourReport.time_worked}
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
          {hourReport.employee.full_name}
        </Typography>
      </Box>
      <Box sx={{width: '25%'}}>
        <Typography
          fontWeight="md"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {hourReport.task}
        </Typography>
      </Box>
      <Box sx={{width: '20%'}}>
        <Typography fontWeight="md">{hourReport.time_worked}</Typography>
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
              setOpen(true);
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

export default HourReportCard;
