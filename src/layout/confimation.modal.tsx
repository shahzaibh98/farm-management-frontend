import {
  Button,
  Flex,
  Group,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';

const DeleteModel = ({
  id,
  onDelete,
  opened,
  setOpened,
  resourceName = '',
}: any) => {
  const theme = useMantineTheme();
  return (
    <Modal
      opened={opened}
      centered
      onClose={() => setOpened(false)}
      withCloseButton={false}
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: theme.colors.primaryColors[0],
        },
      }}
      transitionProps={{ transition: 'fade-up', duration: 300 }}
      title="Delete Confirmation"
    >
      <Text className="text-body1 font-normal tracking-wide mb-6">
        Are you sure you want to delete this {resourceName}?
      </Text>

      <Flex
        mih={50}
        gap="xs"
        justify="flex-end"
        align="flex-start"
        className="mt-5"
      >
        <Button
          variant="outline"
          autoContrast
          color={theme.colors.secondaryColors[3]}
          size="md"
          onClick={() => setOpened()}
          style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          <Text tt="capitalize" fs="italic" p={2}>
            {'Cancel'}
          </Text>
        </Button>
        <Button
          variant="outline"
          autoContrast
          color={theme.colors.primaryColors[0]}
          size="md"
          onClick={() => {
            onDelete(id);
            setOpened();
          }}
          style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          <Text tt="capitalize" fs="italic" p={2}>
            Delete
          </Text>
        </Button>
      </Flex>
    </Modal>
  );
};

export default DeleteModel;
