import { useForm } from "react-hook-form";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

export const loginValidation = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: { value: 6, message: "At least 6 characters" },
  },
};

export interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const handleLogin = (data: LoginFormInputs) => {};

  return (
    <Grid container minHeight={"100dvh"}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <img
          height={40}
          width={116}
          alt="panuwat"
          src="/images/login/logo.webp"
        />
        <Typography
          mt={3}
          mb={4}
          variant="h4"
          color="primary"
          fontWeight={700}
          textAlign="center"
        >
          Welcome back
        </Typography>
        <Box
          noValidate
          width={"100%"}
          maxWidth={360}
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{ p: { xs: 2, md: 0 } }}
        >
          <Box>
            <Typography variant="body2">
              Email <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              required
              fullWidth
              margin="normal"
              placeholder="Enter your Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", loginValidation.email)}
            />
          </Box>

          <Box>
            <Typography variant="body2">
              Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              required
              fullWidth
              type="password"
              margin="normal"
              label="Enter your Password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", loginValidation.password)}
            />
          </Box>

          <Button
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            LOGIN
          </Button>
        </Box>
      </Grid>

      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url('/images/login/image.webp')",
        }}
      />
    </Grid>
  );
}
