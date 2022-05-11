import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Input } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
// import FormLabel from "@material-ui/core/FormLabel";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import Radio from "@material-ui/core/Radio";
import { Radio, RadioGroup, FormLabel } from "@mui/material";
// import RadioGroup from "@material-ui/core/RadioGroup";
import axios from "axios";
import { breakpoints } from "@mui/system";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Not really by NSU // "}
      <Link color="inherit" href="/">
        NSU Complaints
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUp2() {
  const [role, setRole] = React.useState("");

  const [serverState, setServerState] = React.useState();

  const handleServerResponse = (ok, msg) => {
    setServerState({ ok, msg });
  };

  const [emailMessage, setEmailMessage] = React.useState(false);
  const [email, setEmail] = React.useState();

  const validationSchema = Yup.object().shape({
    role: Yup.string()
      .oneOf(["1", "2", "3", "4"], "Required")
      .required("Role is required"),
    name: Yup.string().min(3, "It's too short").required("Name is required"),
    email: Yup.string().when("role", {
      is: (role) => role === "4",
      then: Yup.string().required("Field is required"),
      otherwise: Yup.string(),
    }),
    nsuemail: Yup.string().when("role", {
      is: (role) => role == "1" || role == "2" || role == "3",
      then: Yup.string()
      .email("Enter valid email adrress")
      .test(
        "check-nsu-email",
        "This is not a valid NSU email address",

        function (value) {
          //  logic to check the domain

          if (/@northsouth.edu\s*$/.test(value)) {
            console.log("it ends in @northsouth.edu");
            return true;
          }
          return false;
        }
      ),
      otherwise: Yup.string(),
    }),

    nsuid: Yup.string()
      // .number("Enter numbers only")
      .length(10, "NSU ID should be of 10 characters length")
      .required("NSU ID  is required"),
    password: Yup.string()
      .min(8, "Password minimum length should be 8")
      .required("Password is required"),
  });
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (values, props) => {
    console.log(values);
    console.log(props);
    var email;
    if (values.email == "") {
      email = values.nsuemail;
    }
    console.log(email);
    setTimeout(() => {
      props.resetForm();
      props.setSubmitting(false);
    }, 2000);

    // eslint-disable-next-line no-console

    if (values.role == "1" || values.role == "2" || values.role == "3")
      setRole("user");
    console.log({
      roles: values.role,
      name: values.name,
      nsuid: values.nsuid,
      email: email,
      password: values.password,
    });

    axios
      .post("/signup", {
        role: values.role,
        name: values.name,
        nsuid: values.nsuid,
        email: email,
        password: values.password,
      })
      .then(function (response) {
        console.log(response);
        if(response.status == '200'){
          setEmailMessage(true)
        }
        props.setSubmitting(false);
        props.resetForm();
        // handleServerResponse(true, "Thanks!");
      })
      .catch(function (error) {
        console.log(error);
        props.setSubmitting(false);
        handleServerResponse(false, error.response.data.error);
      });

    // axios.post('/signup/idupload',{
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   params:{
    //     "nsuid": data.get('nsuid')
    //   }
    // })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 3, backgroundColor: "#1976d2" }}>
          <AccountCircleIcon sx={{ width: 40, height: 40 }} />
        </Avatar>

        <Typography component="h1" variant="h5">
          NSU COMPLAINTS // SIGN UP
        </Typography>
        <br />
        {emailMessage ? (
          <Typography align="center" color="black">
            <br />
            An email has been sent to {email} please click on the link to
            activate your account.{" "}
          </Typography>
        ) : null}
        <Formik
          initialValues={{
            role: "",
            name: "",
            email: "",
            nsuemail: "@northsouth.edu",
            nsuid: "",
            password: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form>
              <FormControl component="fieldset" onChange={handleChange}>
                <FormLabel component="legend">Role</FormLabel>

                <Field
                  as={RadioGroup}
                  aria-label="role"
                  name="role"
                  style={{ display: "initial" }}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Student"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Faculty"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Admin Employee"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label="Helping Staff"
                  />
                </Field>
              </FormControl>

              <FormHelperText>
                <ErrorMessage name="role">
                  {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                </ErrorMessage>
              </FormHelperText>

              <br></br>
              <Field
                as={TextField}
                required
                fullWidth
                name="name"
                label="Name"
                placeholder="Enter your name"
                helperText={
                  <ErrorMessage name="name">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                }
              />
              <br></br>
              <br></br>
              <Field
                as={TextField}
                required
                fullWidth
                name="nsuid"
                label="NSU ID"
                placeholder="Enter your NSU ID"
                helperText={
                  <ErrorMessage name="nsuid">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                }
              />
              <br></br>
              <br></br>
              {role == "4" ? (
                <Field
                  as={TextField}
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  helperText={
                    <ErrorMessage name="email">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  }
                />
              ) : (
                <Field
                  as={TextField}
                  required
                  fullWidth
                  name="nsuemail"
                  label="NSU Email"
                  placeholder="Enter your NSU email"
                  helperText={
                    <ErrorMessage name="nsuemail">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  }
                />
              )}

              <br></br>
              <br></br>
              <Field
                as={TextField}
                required
                fullWidth
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                helperText={
                  <ErrorMessage name="password">
                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                  </ErrorMessage>
                }
              />
              <br></br>
              <br></br>
              <Button
                type="submit"
                variant="contained"
                disabled={props.isSubmitting}
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                {props.isSubmitting ? "Loading" : "Sign up"}
              </Button>
              {serverState && (
                <p className={!serverState.ok ? "errorMsg" : ""}>
                  {serverState.msg}
                </p>
              )}
            </Form>
          )}
        </Formik>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Link href="/login" variant="body2">
            <Typography align="center">{"Have an account? Log In"}</Typography>
          </Link>
        </Grid>
      </Grid>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
