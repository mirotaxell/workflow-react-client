import {
  Box,
  Modal,
  Typography,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {Context} from '../App';
import {
  useProjectByIdQuery,
  useTextReportByProjectQuery,
} from '../graphql/useRequest';
import {
  CREATE_TEXT_REPORT,
  GET_PROJECT_BY_ID,
  GET_TEXT_REPORTS_BY_PROJECT,
} from '../graphql/graphql';
import {useMutation} from '@apollo/react-hooks';
import TextReportCard from '../components/textReportCard';
import {checkUserRole} from '../utils/checkUserRole';
import {modalStyle} from '../utils/modalStyle';

type Props = {};
export const ReportsSection: React.FC<Props> = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;
  const {project} = useContext(Context);

  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isSupervisor, setIsSupervisor] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [formState, setFormState] = useState({
    title: '',
    text: '',
  });

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const {loading, error, data} = useTextReportByProjectQuery(
    GET_TEXT_REPORTS_BY_PROJECT,
    project
  );

  const {data: data2} = useProjectByIdQuery(GET_PROJECT_BY_ID, project);

  const [addTextReport] = useMutation(CREATE_TEXT_REPORT, {
    variables: {
      title: formState.title,
      text: formState.text,
      projectId: project,
    },
    refetchQueries: [
      {query: GET_TEXT_REPORTS_BY_PROJECT, variables: {projectId: project}},
    ],
    onCompleted: ({addTextReport}) => {
      console.log(addTextReport);
    },
  });

  useEffect(() => {
    if (data2?.projectById.supervisor.id === user.id) {
      setIsSupervisor(true);
    }
    checkUserRole().then((res) => {
      if (res) {
        setIsAdmin(true);
      }
    });
  }, [data]);

  const onSubmit = () => {
    if (formState.title.length < 3) {
      setErrorMessage('Report title must be at least 3 characters long');
      return;
    }
    if (formState.text.length < 3) {
      setErrorMessage('Report text must be at least 3 characters long');
      return;
    }
    setErrorMessage('');
    addTextReport();
    handleModalClose();
  };

  if (!project) return <></>;
  if (loading)
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  if (error)
    return (
      <>
        <h1>Error</h1>
      </>
    );
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
            Adding a text report
          </Typography>
          <Divider sx={{margin: '10px'}} />
          <TextField
            value={formState.title}
            onChange={(e) =>
              setFormState({
                ...formState,
                title: e.target.value,
              })
            }
            required
            onFocus={() => setErrorMessage('')}
            id="filled-basic"
            label="Title"
            variant="outlined"
            sx={{marginBottom: '10px', width: '100%'}}
          />
          <TextField
            value={formState.text}
            onChange={(e) =>
              setFormState({
                ...formState,
                text: e.target.value,
              })
            }
            multiline
            required
            onFocus={() => setErrorMessage('')}
            id="filled-basic"
            label="Report text"
            variant="outlined"
            sx={{marginBottom: '10px', width: '100%'}}
          />

          <Divider sx={{margin: '10px'}} />
          <Typography variant="body2" sx={{color: 'red', margin: '10px'}}>
            {errorMessage}
          </Typography>
          <Button variant="contained" type="submit">
            Add text report
          </Button>
        </Box>
      </Modal>
      <Typography variant="h4" sx={{margin: '10px'}}>
        Reports
      </Typography>
      <Button
        onClick={() => {
          handleModalOpen();
        }}
        sx={{marginLeft: '10px'}}
      >
        Add a text report
      </Button>
      <Divider sx={{margin: '10px'}} />
      <div style={{height: '500px', overflowY: 'scroll'}}>
        {data?.textReportsByProject.map((textReport: any) => (
          <TextReportCard
            key={textReport.id}
            textReport={textReport}
            perms={isAdmin || isSupervisor}
          />
        ))}
      </div>
    </Box>
  );
};
