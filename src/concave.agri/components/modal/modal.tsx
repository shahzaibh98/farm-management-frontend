import React from 'react';
import { Modal as MantineModal, ModalProps } from '@mantine/core';

interface CustomModalProps
  extends Omit<ModalProps, 'opened' | 'onClose' | 'title'> {
  opened: boolean;
  onClose: () => void;
  title: string;
  [key: string]: any; // Index signature for additional props
}

const CustomModal: React.FC<CustomModalProps> = ({
  opened,
  onClose,
  title,
  children,
  ...rest
}) => {
  return (
    <MantineModal opened={opened} onClose={onClose} title={title} {...rest}>
      {children}
    </MantineModal>
  );
};

export default CustomModal;
