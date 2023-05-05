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
import {useCompanyQuery} from '../graphql/useRequest';
import {CREATE_COMPANY, GET_COMPANIES} from '../graphql/graphql';
import {Context} from '../App';
import {ICompany} from '../types/company';
import {useMutation} from '@apollo/react-hooks';
import {graphqlFetch} from '../graphql/graphqlFetch';
import {modalStyle} from '../utils/modalStyle';

type Props = {};
export const CompanySection: React.FC<Props> = () => {
  const {project, company, setCompanyContext} = useContext(Context);
  const {loading, error, data} = useCompanyQuery(GET_COMPANIES);
  const [selectedCompany, setCompany] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
    setCompanyContext(event.target.value as string);
  };

  const [formState, setFormState] = useState({
    name: '',
  });

  const [addCompany] = useMutation(CREATE_COMPANY, {
    variables: {
      companyName: formState.name,
    },
    refetchQueries: [{query: GET_COMPANIES}],
    onCompleted: ({addCompany}) => {
      console.log(addCompany);
    },
  });

  const onSubmit = () => {
    if (formState.name.length < 3) {
      setErrorMessage('Company name must be at least 3 characters long');
      return;
    }
    if (formState.name.length > 32) {
      setErrorMessage('Company name must be at most 32 characters long');
      return;
    }
    setErrorMessage('');
    addCompany();
    handleModalClose();
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong!</h1>;
  return (
    <Box py={4} sx={{width: '40%'}}>
      <div className="companies">
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
              Creating a company
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
              label="Name of company"
              variant="outlined"
            />
            <Divider sx={{margin: '10px'}} />
            <Typography variant="body2" sx={{color: 'red', margin: '10px'}}>
              {errorMessage}
            </Typography>
            <Button type="submit" variant="contained">
              Create company
            </Button>
          </Box>
        </Modal>
        <div>
          <h1>Company</h1>
          <Button onClick={handleModalOpen}>Create a company</Button>
        </div>

        <Divider
          style={{
            marginBottom: '20px',
            marginTop: '20px',
          }}
        />

        <FormControl variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-standard-label">
            Select company
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedCompany}
            label="Company"
            onChange={handleChange}
            disabled={project ? true : false}
          >
            <MenuItem key={0} value={''}>
              <em>None</em>
            </MenuItem>
            {data?.companies.map((company: ICompany) => (
              <MenuItem key={company.id} value={company.id}>
                {company.company_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Box>
  );
};
