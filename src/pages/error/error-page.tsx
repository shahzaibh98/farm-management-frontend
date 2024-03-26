import {
  Button,
  Container,
  Image,
  SimpleGrid,
  useMantineTheme,
} from '@mantine/core';
import { Error404Image, Error500Image } from '../../assets/images';
import { Text } from '../../concave.agri/components';

const ErrorPage = ({ errorNumber = 404 }: { errorNumber?: number }) => {
  const theme = useMantineTheme();
  return (
    <Container className="py-20 md:py-32">
      <SimpleGrid spacing={{ base: 10, sm: 20 }} cols={{ base: 1, sm: 2 }}>
        <Image
          src={errorNumber === 404 ? Error404Image : Error500Image}
          className="hidden md:block"
        />
        <div className="flex flex-col justify-center ml-4">
          <Text size="xl" c={theme.colors.secondaryColors[0]} tt="uppercase">
            {errorNumber === 404
              ? 'Something is not right...'
              : 'Something bad just happened...'}
          </Text>
          <Text className="text-gray-500 text-lg">
            {errorNumber === 404
              ? 'Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL.'
              : "Our servers could not handle your request. Don't worry, our development team was already notified. Try refreshing the page"}
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="6"
            className="mt-6 w-full md:w-auto"
            color={theme.colors.secondaryColors[0]}
          >
            <Text size="md" c={theme.colors.secondaryColors[0]} tt="capitalize">
              Get back to home page
            </Text>
          </Button>
        </div>
      </SimpleGrid>
    </Container>
  );
};

export default ErrorPage;
