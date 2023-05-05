import * as React from 'react';
import {LOGIN_MUTATION, SIGNUP_MUTATION} from '../graphql/graphql';
import {useMutation} from '@apollo/react-hooks';
import {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {logoImg} from '../assets';

type Props = {};
const LoginForm: React.FC<Props> = () => {
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [loginErrorAlertOpen, setLoginErrorAlertOpen] = React.useState(false);
  const [signupErrorAlertOpen, setSignupErrorAlertOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setLoginErrorAlertOpen(false);
    setSignupErrorAlertOpen(false);
    setAlertOpen(false);
  };

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      username: formState.email,
      password: formState.password,
    },
    onError: (error) => {
      console.log('error', error.graphQLErrors);
      setErrors(error.graphQLErrors);
      setLoginErrorAlertOpen(true);
    },
    onCompleted: ({login}) => {
      console.log('login', login);
      localStorage.setItem('token', login.token);
      localStorage.setItem('user', JSON.stringify(login.user));
      window.location.reload();
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      full_name: formState.name,
      password: formState.password,
      email: formState.email,
    },
    onError: (error) => {
      console.log('error', error.graphQLErrors);
      setErrors(error.graphQLErrors);
      setSignupErrorAlertOpen(true);
    },
    onCompleted: ({signup}) => {
      setFormState({
        login: true,
        email: '',
        password: '',
        name: '',
      });
      setAlertOpen(true);
    },
  });

  const onSubmit = () => {
    if (formState.login) login();
    else {
      if(formState.name.length < 3) {
        setErrorMessage("Username must be at least 3 characters long");
        return;
      }
      if(formState.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return;
      }
      setErrorMessage("");
      signup();
    }
  };

  return (
    <div className="App">
      <Snackbar open={alertOpen} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
          Account created successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={loginErrorAlertOpen}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
          Invalid credentials
        </Alert>
      </Snackbar>
      <Snackbar
        open={signupErrorAlertOpen}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
          Something went wrong, check your signup details and try again
        </Alert>
      </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5} sx={{}}>
            <img width="54px" height="54px" src={logoImg} alt="logo" />
            <Typography variant="h5" sx={{width: 'fit-content'}}>
              WorkFlow
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e) => (e.preventDefault(), onSubmit())}
            sx={{mt: 1}}
          >
            {!formState.login && (
              <TextField
                value={formState.name}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Username"
                name="name"
                autoComplete="name"
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  })
                }
              />
            )}

            <TextField
              value={formState.email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={(e) =>
                setFormState({
                  ...formState,
                  email: e.target.value,
                })
              }
            />
            <TextField
              value={formState.password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                setFormState({
                  ...formState,
                  password: e.target.value,
                })
              }
            />
            <Typography variant="body2" sx={{color: 'red'}}>
              {errorMessage}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              {formState.login ? 'Sign in' : 'Create account'}
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) =>
                    setFormState({
                      ...formState,
                      login: !formState.login,
                    })
                  }
                >
                  {formState.login
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account?'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default LoginForm;
