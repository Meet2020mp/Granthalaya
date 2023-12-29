import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';


export default function Feedback(props){
    const [snackPack, setSnackPack] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState(undefined);
    const [feedbackType, setFeedbackType] = React.useState(undefined);
    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
  const handleClick = (message) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };
  const handleExited = () => {
    setMessageInfo(undefined);
  };
  useEffect(()=>{
    console.log(props.mes);
    setMessageInfo(props.mes)
    setOpen(props.open)
    setFeedbackType(props.type)
  },[])
  return(
  // <Snackbar
  //       key={messageInfo ? messageInfo.key : undefined}
  //       open={open}
  //       autoHideDuration={6000}
  //       onClose={handleClose}
  //       TransitionProps={{ onExited: handleExited }}
  //       message={messageInfo ? messageInfo.message : undefined}
  //       action={
  //         <React.Fragment>
  //           <Button color="secondary" size="small" onClick={handleClose}>
  //             UNDO
  //           </Button>
  //           <IconButton
  //             aria-label="close"
  //             color="inherit"
  //             sx={{ p: 0.5 }}
  //             onClick={handleClose}
  //           >
  //             <CloseIcon />
  //           </IconButton>
  //         </React.Fragment>
  //       }
  //     />
  <Stack spacing={2} sx={{ width: '100%' }}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar open={open} anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={feedbackType} sx={{ width: '100%' }}>
          {messageInfo}
        </Alert>
      </Snackbar>
    </Stack>
  )
    }