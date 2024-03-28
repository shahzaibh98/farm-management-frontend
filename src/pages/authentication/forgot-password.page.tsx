import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  return (
    <Container size={460} my={30}>
      <Title
        className={
          'text-3xl font-semibold font-greycliff text-secondaryColors-100'
        }
        ta="center"
      >
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput label="Your email" placeholder="Enter your email" required />
        <Group
          justify="space-between"
          mt="lg"
          className={'flex flex-row-reverse'}
        >
          <Anchor
            c="dimmed"
            size="sm"
            className={'sm:w-full sm:text-center'}
            onClick={() => navigate('/login')}
          >
            <Center inline>
              <IconArrowLeft
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
          <Button
            className={'sm:w-full sm:text-center'}
            fullWidth
            style={{ backgroundColor: theme.colors.secondaryColors[3] }}
          >
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
