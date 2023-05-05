import {Delete, Edit, OpenInFull} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {IItem} from '../types/item';
import {checkUserRole} from '../utils/checkUserRole';
import {useProjectByIdQuery} from '../graphql/useRequest';
import {DELETE_ITEM, GET_PROJECT_BY_ID, UPDATE_ITEM} from '../graphql/graphql';
import {Context} from '../App';
import {useMutation} from '@apollo/react-hooks';
import {Card} from '@mui/joy';
import {modalStyle} from '../utils/modalStyle';

type Props = {
  item: IItem;
  index: number;
  perms: boolean;
};

const ItemCard: React.FC<Props> = ({item, index, perms}) => {
  const [open, setOpen] = React.useState(false);
  const [openFull, setOpenFull] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [itemState, setItemState] = useState({
    item_name: item.item_name,
    amount: item.amount,
  })
  const handleModalOpen = () => setOpenEdit(true);
  const handleModalClose = () => setOpenEdit(false);
  const [removeItem] = useMutation(DELETE_ITEM, {
    variables: {
      id: item.id,
    },
    onCompleted: (data) => {},
  });

  const [formState, setFormState] = useState({
    item_name: '',
    amount: '',
  });

  const [updateItem] = useMutation(UPDATE_ITEM, {
    variables: {
      updateItemId: item.id,
      itemName: formState.item_name,
      amount: formState.amount,
    },
    onCompleted: (data) => {
      setItemState({
        item_name: formState.item_name,
        amount: formState.amount,
      })
    },
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
        <DialogTitle id="alert-dialog-title">{'Delete item'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              removeItem();
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
        <DialogTitle id="alert-dialog-title">{itemState.item_name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Amount: {itemState.amount}
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
      <Modal
        open={openEdit}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editing: {itemState.item_name}
          </Typography>
          <Divider sx={{margin: '10px'}}/>
          <TextField
            value={formState.item_name}
            onChange={(e) =>
              setFormState({
                ...formState,
                item_name: e.target.value,
              })
            }
            id="filled-basic"
            label="Item name"
            variant="outlined"
            placeholder={item.item_name}
            sx={{marginBottom: '10px', width: '100%'}}
          />
          <TextField
            value={formState.amount}
            onChange={(e) =>
              setFormState({
                ...formState,
                amount: e.target.value,
              })
            }
            id="filled-basic"
            label="Amount"
            variant="outlined"
            placeholder={item.amount}
            sx={{marginBottom: '10px', width: '100%'}}
          />
          <Divider sx={{margin: '10px'}} />
          <Button
            onClick={(e) => {
              handleModalClose();
            }}
          >
            Close
          </Button>
          <Button
            onClick={(e) => {
              updateItem();
              handleModalClose();
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>
      <Box sx={{width: '35%'}}>
        <Typography
          fontWeight="md"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {itemState.item_name}
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
          {itemState.amount}
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
              setOpenEdit(true);
            }}
          >
            <Edit />
          </IconButton>
        ) : (
          <></>
        )}
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

export default ItemCard;
