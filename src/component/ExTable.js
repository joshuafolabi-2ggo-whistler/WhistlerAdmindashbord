import React, { useState, useEffect } from 'react';
import {
  Box,
  Toolbar,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: 'AKIAQKGGXQ77UYXWY4UX',
  secretAccessKey: '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',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const ExTable = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const params = {
      TableName: 'profile_table',
    };
    try {
      const data = await dynamodb.scan(params).promise();
      const filteredItems = data.Items.filter(
        (item) =>
          !item.username.startsWith('signinwithapple') &&
          !item.username.startsWith('default') &&
          !item.username.startsWith('google')
      );

      setUser(filteredItems);
      console.log(filteredItems)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleValidateUser = async () => {
    if (!selectedUserId || !selectedAction) return;

    setLoading(true);

    const params = {
      TableName: 'profile_table',
      Key: {
        user_id: selectedUserId,
      },
      UpdateExpression: 'set validation_status = :newStatus',
      ExpressionAttributeValues: {
        ':newStatus': selectedAction,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      await dynamodb.update(params).promise();
      console.log('Update succeeded');
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }

    setLoading(false);
    handleCloseModal();
  };

  const handleOpenModal = (userId, action) => {
    setSelectedUserId(userId);
    setSelectedAction(action);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUserId(null);
    setSelectedAction('');
  };

  const filteredUsers = user.filter(
    (item) =>
      item.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#ffffff',
          p: 4,
          transition: 'margin 0.3s ease',
        }}
      >
        <Toolbar />
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <TextField
              fullWidth
              label="Search user"
              placeholder="Search by First Name or Last Name in Lower case"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name & Email</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Report Flag</TableCell>
                  <TableCell align="right">Verify User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: user.report_flags === 'flag'
                        ? 'rgba(255, 0, 0, 0.1)' 
                        : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.validation_status}</TableCell>
                    <TableCell>
                      {user.report_flags && (
                        <Typography
                          variant="body2"
                          color="error"
                          fontWeight="bold"
                        >
                          {user.report_flags}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleOpenModal(user.user_id, 'approved')}
                        variant="text"
                        color="primary"
                      >
                        Verify
                      </Button>
                      <Button
                        onClick={() => handleOpenModal(user.user_id, 'pending')}
                        variant="text"
                        color="warning"
                      >
                        Revoke
                      </Button>
                      <Button
                        onClick={() => handleOpenModal(user.user_id, 'block')}
                        variant="text"
                        color="secondary"
                      >
                        Block
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the user's status to{' '}
            <strong>{selectedAction}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleValidateUser} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExTable;
