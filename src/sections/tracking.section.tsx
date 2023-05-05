import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {Context} from '../App';
import {
  useHourReportByProjectQuery,
  useProjectByIdQuery,
} from '../graphql/useRequest';
import {
  CREATE_HOUR_REPORT,
  GET_HOUR_REPORTS_BY_PROJECT,
  GET_PROJECT_BY_ID,
} from '../graphql/graphql';
import {useMutation} from '@apollo/react-hooks';
import HourReportCard from '../components/hourReportCard';
import {modalStyle} from '../utils/modalStyle';
import {checkUserRole} from '../utils/checkUserRole';

type Props = {};
export const TrackingSection: React.FC<Props> = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;

  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isSupervisor, setIsSupervisor] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [formState, setFormState] = useState({
    task: '',
    timeWorked: '',
  });

  const {project} = useContext(Context);
  const {loading, error, data} = useHourReportByProjectQuery(
    GET_HOUR_REPORTS_BY_PROJECT,
    project
  );

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useProjectByIdQuery(GET_PROJECT_BY_ID, project);

  useEffect(() => {
    if (data2?.projectById.supervisor.id === user.id) {
      setIsSupervisor(true);
    }
    checkUserRole().then((res) => {
      if (res) {
        setIsAdmin(true);
      }
    });
  }, [data2]);

  const [addHourReport] = useMutation(CREATE_HOUR_REPORT, {
    variables: {
      task: formState.task,
      projectId: project,
      timeWorked: formState.timeWorked,
    },
    refetchQueries: [
      {query: GET_HOUR_REPORTS_BY_PROJECT, variables: {projectId: project}},
    ],
    onCompleted: ({addHourReport}) => {
      console.log(addHourReport);
    },
  });

  const onSubmit = () => {
    if (formState.task.length < 2) {
      setErrorMessage('Task must be at least 2 characters long');
      return;
    }
    const regex: RegExp =
      /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
    console.log(formState.timeWorked, regex.test(formState.timeWorked));
    if (!regex.test(formState.timeWorked)) {
      setErrorMessage(
        'Time worked must be in the correct format: [hh:mm]-[hh:mm] (e.g 07:30 - 13:00)'
      );
      return;
    }
    setErrorMessage('');
    addHourReport();
    handleModalClose();
  };

  if (!project) return <></>;
  if (loading) return <>Loading...</>;
  if (error) return <>Error</>;
  return (
    <Box
      py={4}
      sx={{
        boxShadow: 2,
        borderRadius: '5px',
        backgroundColor: 'rgb(244, 244, 244)',
        padding: '2rem',
      }}
    >
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={modalStyle}
          component="form"
          onSubmit={(e) => (e.preventDefault(), onSubmit())}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding an hour report
          </Typography>
          <Divider sx={{margin: '10px'}} />
          <TextField
            value={formState.task}
            onChange={(e) =>
              setFormState({
                ...formState,
                task: e.target.value,
              })
            }
            required
            id="filled-basic"
            label="Task"
            variant="outlined"
            sx={{marginBottom: '10px', width: '100%'}}
          />
          <TextField
            value={formState.timeWorked}
            onChange={(e) => {
              setFormState({
                ...formState,
                timeWorked: e.target.value,
              });
            }}
            required
            id="filled-basic"
            label="Time worked: [hh:mm]-[hh:mm]"
            variant="outlined"
            sx={{marginBottom: '10px', width: '100%'}}
          />

          <Divider sx={{margin: '10px'}} />
          <Typography variant="body2" sx={{color: 'red', margin: '10px'}}>
            {errorMessage}
          </Typography>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Box>
      </Modal>
      <Typography variant="h4" sx={{margin: '10px'}}>
        Time Tracking
      </Typography>
      <Button
        onClick={() => {
          handleModalOpen();
        }}
        sx={{marginLeft: '10px'}}
      >
        Add a time report
      </Button>

      <Divider sx={{margin: '10px'}} />
      <div style={{height: '500px', overflowY: 'scroll'}}>
        {data?.hourReportsByProject.map((hourReport: any) => (
          <HourReportCard
            key={hourReport.id}
            hourReport={hourReport}
            perms={isAdmin || isSupervisor}
          />
        ))}
      </div>
    </Box>
  );
};
