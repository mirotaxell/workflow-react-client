import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {Context} from '../App';
import {
  CREATE_INVENTORY,
  CREATE_ITEM_AND_ADD_TO_INVENTORY,
  GET_INVENTORY_BY_PROJECT,
  GET_PROJECT_BY_ID,
} from '../graphql/graphql';
import {
  useInventoryByProjectQuery,
  useProjectByIdQuery,
} from '../graphql/useRequest';
import {useMutation} from '@apollo/react-hooks';
import {modalStyle} from '../utils/modalStyle';
import ItemCard from '../components/item';
import {checkUserRole} from '../utils/checkUserRole';

type Props = {};
export const InventorySection: React.FC<Props> = () => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;
  const {project} = useContext(Context);

  const [openModal, setOpenModal] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isSupervisor, setIsSupervisor] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [formState, setFormState] = useState({
    item_name: '',
    amount: '',
  });

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const {loading, data} = useInventoryByProjectQuery(
    GET_INVENTORY_BY_PROJECT,
    project
  );

  const {data: data2} = useProjectByIdQuery(GET_PROJECT_BY_ID, project);

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

  const [addItem] = useMutation(CREATE_ITEM_AND_ADD_TO_INVENTORY, {
    variables: {
      itemName: formState.item_name,
      amount: formState.amount,
      inventoryId: data?.inventoryByProjectId.id,
    },
    refetchQueries: [
      {query: GET_INVENTORY_BY_PROJECT, variables: {projectId: project}},
    ],
    onCompleted: ({addItem}) => {
      console.log(addItem);
    },
  });

  const [addInventory] = useMutation(CREATE_INVENTORY, {
    variables: {
      projectId: project,
    },
    refetchQueries: [
      {query: GET_INVENTORY_BY_PROJECT, variables: {projectId: project}},
    ],
    onCompleted: ({addInventory}) => {
      console.log(addInventory);
    },
  });

  const onSubmit = () => {
    if (formState.item_name.length < 3) {
      setErrorMessage('Item name must be at least 3 characters long');
      return;
    }
    setErrorMessage('');
    addItem();
    handleModalClose();
  };

  if (loading) return <>Loading...</>;
  if (!project) return <></>;
  return (
    <Box>
      {!data && (
        <Box
          py={4}
          sx={{
            boxShadow: 2,
            borderRadius: '5px',
            backgroundColor: 'rgb(244, 244, 244)',
            padding: '2rem',
          }}
        >
          <Typography variant="h4" sx={{margin: '10px'}}>
            Inventory
          </Typography>
          <Button
            onClick={() => {
              addInventory();
            }}
            sx={{marginLeft: '10px'}}
          >
            Create an inventory
          </Button>
        </Box>
      )}
      {data && (
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
                Adding an item
              </Typography>
              <Divider sx={{margin: '10px'}} />
              <TextField
                value={formState.item_name}
                onFocus={() => setErrorMessage('')}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    item_name: e.target.value,
                  })
                }
                required
                id="filled-basic"
                label="Name of item"
                variant="outlined"
                sx={{marginBottom: '10px'}}
              />
              <TextField
                id="outlined-number"
                label="Amount of item"
                variant="outlined"
                required
                value={formState.amount}
                onFocus={() => setErrorMessage('')}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    amount: e.target.value,
                  })
                }
              />
              <Divider sx={{margin: '10px'}} />
              <Typography variant="body2" sx={{color: 'red', margin: '10px'}}>
                {errorMessage}
              </Typography>
              <Button type="submit" variant="contained">
                Add item
              </Button>
            </Box>
          </Modal>
          <Typography variant="h4" sx={{margin: '10px'}}>
            Inventory
          </Typography>
          <Button
            onClick={() => {
              handleModalOpen();
            }}
            sx={{marginLeft: '10px'}}
          >
            Add an item
          </Button>
          <Divider sx={{margin: '10px'}} />
          <div style={{height: '500px', overflowY: 'scroll'}}>
            <Box sx={{flexGrow: 1}}>
              <Grid container columns={{xs: 4, sm: 8, md: 12}}>
                {data?.inventoryByProjectId.items.map((item, index) => (
                  <Grid item xs={12} sm={12} md={12} key={index}>
                    <ItemCard
                      item={item}
                      index={0}
                      perms={isAdmin || isSupervisor}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        </Box>
      )}
    </Box>
  );
};
