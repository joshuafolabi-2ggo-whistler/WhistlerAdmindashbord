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
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material'; // For expand/collapse icons
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
  const [openRows, setOpenRows] = useState({}); // Track open/close states of rows

  const fetchData = async () => {
    setLoading(true);
    const params = {
      TableName: 'profile_table',
    };
    try {
      const data = await dynamodb.scan(params).promise();
      console.log(data)
      const filteredItems = data.Items.filter(
        (item) =>
          !item.username.startsWith('signinwithapple') &&
          !item.username.startsWith('default') &&
          !item.username.startsWith('google')
      ).sort((a, b) => {
        const hasReportsA = a.reports?.length > 0 ? 1 : 0;
        const hasReportsB = b.reports?.length > 0 ? 1 : 0;
        return hasReportsB - hasReportsA;
      });

      setUser(filteredItems);
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

  const handleRowToggle = (index) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
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
          bgcolor: '#f0f0f0',
          p: 4,
          transition: 'margin 0.3s ease',
        }}>
        
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
                  <TableCell />
                  <TableCell>Full Name & Email</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Report Flag</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <React.Fragment key={index}>
                    <TableRow style={{
        backgroundColor: user.reports?.length > 0 ? '#FFCCCB' : 'white'
      }}>
                      <TableCell>
                        <IconButton onClick={() => handleRowToggle(index)}>
                          {openRows[index] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.validation_status}</TableCell>
                      <TableCell>{user.report_flags}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => handleOpenModal(user.user_id, 'approved')}
                          color="primary"
                        >
                          Verify
                        </Button>
                        <Button
                          onClick={() => handleOpenModal(user.user_id, 'pending')}
                          color="warning"
                        >
                          Revoke
                        </Button>
                        <Button
                          onClick={() => handleOpenModal(user.user_id, 'block')}
                          color="secondary"
                        >
                          Block
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                          <Box sx={{ m: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Report Details:
                            </Typography>
                            {user.reports?.length > 0 ? (
                              user.reports.map((report, reportIndex) => (
                                <Box key={reportIndex} sx={{ mb: 1 }}>
                                  <Typography variant="body1">
                                    <strong>Message:</strong> {report.message}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Room Code:</strong> {report.room_code}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Reported User:</strong> {report.reported_user}
                                  </Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography>No Reports</Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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
