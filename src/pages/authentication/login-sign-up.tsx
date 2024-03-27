import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';

export function AuthenticationForm() {
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  const handleCreateAccountClick = () => {
    setShowCreateAccountForm(true);
    setShowForgotPasswordForm(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordForm(true);
    setShowCreateAccountForm(false);
  };

  const handleBackButtonClick = () => {
    setShowCreateAccountForm(false);
    setShowForgotPasswordForm(false);
  };

  return (
    <Container size={420} className="my-10">
      <Title className="font-bold text-2xl text-center">Welcome back!</Title>
      {showCreateAccountForm || showForgotPasswordForm ? (
        <Button
          variant="link"
          //   icon={<span>&#8592;</span>}
          className="text-blue-500 hover:underline"
          onClick={handleBackButtonClick}
        >
          Back to login page
        </Button>
      ) : (
        <Text className="text-gray-500 text-sm text-center mt-5">
          Do not have an account yet?{' '}
          <Anchor
            className="text-blue-500 hover:underline"
            component="button"
            onClick={handleCreateAccountClick}
          >
            Create account
          </Anchor>
          <br />
        </Text>
      )}

      {showCreateAccountForm ? (
        <Paper withBorder shadow="md" className="p-8 mt-8 rounded-md">
          <TextInput label="Email" placeholder="Enter your email" required />

          <TextInput
            label="First Name"
            placeholder="Enter your First Name"
            required
          />

          <TextInput
            label="Last Name"
            placeholder="Enter your Last Name"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            className="mt-4"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            required
            className="mt-4"
          />
          <Button fullWidth className="mt-6">
            Create Account
          </Button>
        </Paper>
      ) : showForgotPasswordForm ? (
        <Paper withBorder shadow="md" className="p-8 mt-8 rounded-md">
          <TextInput label="Email" placeholder="Enter your email" required />
          <TextInput
            label="OTP"
            placeholder="Enter OTP"
            required
            className="mt-4"
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            required
            className="mt-4"
          />
          <PasswordInput
            label="Re-enter Password"
            placeholder="Re-enter new password"
            required
            className="mt-4"
          />
          <Button fullWidth className="mt-6">
            Reset Password
          </Button>
        </Paper>
      ) : (
        <Paper withBorder shadow="md" className="p-8 mt-8 rounded-md">
          <TextInput label="Email" placeholder="Enter your email" required />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            className="mt-4"
          />
          <Group className="mt-6" justify="between">
            <Checkbox label="Remember me" />
            <Anchor
              className="text-blue-500 hover:underline"
              component="button"
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth className="mt-10">
            Sign in
          </Button>
        </Paper>
      )}
    </Container>
  );
}
