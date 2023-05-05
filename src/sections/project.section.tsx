import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, {useContext, useState} from 'react';
import {useProjectByCompanyQuery, useProjectQuery} from '../graphql/useRequest';
import {
  CREATE_PROJECT,
  GET_PROJECTS,
  GET_PROJECTS_BY_COMPANY,
} from '../graphql/graphql';
import {IProject} from '../types/project';
import Project from '../components/projectCard';
import {Context} from '../App';
import {useMutation, useQuery} from '@apollo/client';
import {modalStyle} from '../utils/modalStyle';

type Props = {};
export const ProjectSection: React.FC<Props> = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [formState, setFormState] = useState({
    name: '',
  });

  const {company, project, setProjectContext} = useContext(Context);

  const {loading, error, data} = useProjectByCompanyQuery(
    GET_PROJECTS_BY_COMPANY,
    company
  );

  const [selectedProject, setProject] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setProject(event.target.value as string);
    setProjectContext(event.target.value as string);
  };

  const [addProject] = useMutation(CREATE_PROJECT, {
    variables: {
      projectName: formState.name,
      companyId: company,
    },
    refetchQueries: [
      {query: GET_PROJECTS_BY_COMPANY, variables: {companyId: company}},
    ],
    onCompleted: ({addProject}) => {
      console.log(addProject);
    },
  });

  const onSubmit = () => {
    if (formState.name.length < 3) {
      setErrorMessage('Project name must be at least 3 characters long');
      return;
    }
    if (formState.name.length > 32) {
      setErrorMessage('Project name must be at most 32 characters long');
      return;
    }
    setErrorMessage('');
    addProject();
    handleModalClose();
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <Box py={4} sx={{width: '40%'}}>
      <div className="projects">
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
              Creating a project
            </Typography>
            <Divider sx={{margin: '10px'}} />
            <TextField
              value={formState.name}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  name: e.target.value,
                })
              }
              onFocus={() => setErrorMessage('')}
              required
              id="filled-basic"
              label="Name of project"
              variant="outlined"
            />
            <Divider sx={{margin: '10px'}} />
            <Typography variant="body2" sx={{color: 'red', margin: '10px'}}>
              {errorMessage}
            </Typography>
            <Button type="submit" variant="contained">
              Create project
            </Button>
          </Box>
        </Modal>
        <div>
          <h1>Project</h1>
          <Button onClick={handleModalOpen}>Create a project</Button>
        </div>
        <Divider
          style={{
            marginBottom: '20px',
            marginTop: '20px',
          }}
        />
        <FormControl variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-standard-label">
            Select project
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedProject}
            label="Project"
            onChange={handleChange}
            disabled={company ? false : true}
          >
            <MenuItem key={0} value={''}>
              <em>None</em>
            </MenuItem>
            {data?.projectsByCompany.map((project: IProject) => (
              <MenuItem key={project.id} value={project.id}>
                {project.project_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Box>
  );
};
