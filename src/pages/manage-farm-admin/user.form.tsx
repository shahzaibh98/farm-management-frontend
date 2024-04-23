import { Flex, Grid, useMantineTheme } from '@mantine/core';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { postData, putData } from '../../api/api';
import { Button, Select, Text, TextInput } from '../../concave.agri/components';
import { inputStyle } from '../../theme/common.style';

// Define the UserForm component as a memoized component
const UserForm = React.memo(
  ({
    onCloseButton, // Function to handle close button click
    mode = 'Add', // Form mode: 'Add' or 'Update'
    handleNotification, // Function to handle notifications
    viewOrUpdate,
  }: {
    onCloseButton: () => void;
    mode?: string;
    handleNotification: any;
    viewOrUpdate: any;
  }) => {
    // Access Mantine theme
    const theme = useMantineTheme();

    // Formik form configuration
    const form = useFormik({
      enableReinitialize: true,
      initialValues:
        viewOrUpdate?.type === 'Add'
          ? {
              farmTitle: '', // Initial value for farm title
              name: '', // Initial value for name
              email: '', // Initial value for email
              phoneNo: '', // Initial value for phone number
              roleId: '1', // Default role ID
              isActive: 'true', // Default active status
            }
          : viewOrUpdate.objectData,
      onSubmit: values => {
        viewOrUpdate?.type === 'Edit'
          ? putData(`/farm/${viewOrUpdate.objectData.userId}`, values)
              .then(() => {
                // Handle successful form submission
                handleNotification({
                  isSuccess: true,
                  message: 'Farm Admin updated successfully',
                  title: 'Successfully',
                  isEnable: true,
                });
              })
              .catch(error => {
                // Handle form submission error
                handleNotification({
                  isSuccess: false,
                  message: error?.response?.data?.message ?? error?.message,
                  title: 'Something went wrong',
                  isEnable: true,
                });
              })
          : postData('/farm', values) // Send form data to the server
              .then(() => {
                // Handle successful form submission
                handleNotification({
                  isSuccess: true,
                  message: 'Farm Admin created successfully',
                  title: 'Successfully',
                  isEnable: true,
                });
              })
              .catch(error => {
                // Handle form submission error
                handleNotification({
                  isSuccess: false,
                  message: error?.response?.data?.message ?? error?.message,
                  title: 'Something went wrong',
                  isEnable: true,
                });
              });
      },
    });

    return (
      <div>
        {/* Notification component */}

        {/* Form */}
        <form onSubmit={form.handleSubmit}>
          {/* Grid layout */}
          <Grid>
            {/* Status Select */}
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <Select
                data={['Active', 'Blocked']}
                value={form.values.isActive === 'true' ? 'Active' : 'Blocked'}
                label="Status"
                withAsterisk
                styles={inputStyle}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly &&
                  form.setFieldValue(
                    'isActive',
                    e === 'Active' ? 'true' : 'false'
                  )
                }
              />
            </Grid.Col>

            {/* Farm Title Input */}
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <TextInput
                label="Farm Title"
                placeholder="Enter title"
                withAsterisk
                value={form.values.farmTitle}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly &&
                  form.setFieldValue('farmTitle', e)
                }
                styles={inputStyle}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            {/* Name Input */}
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <TextInput
                label="Name"
                placeholder="Enter name"
                withAsterisk
                value={form.values.name}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly && form.setFieldValue('name', e)
                }
                styles={inputStyle}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            {/* Email and Phone Number Inputs */}
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Email"
                placeholder="Enter email"
                withAsterisk
                value={form.values.email}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly && form.setFieldValue('email', e)
                }
                styles={inputStyle}
                isReadOnly={true}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                label="Phone No."
                placeholder="Enter phone number"
                withAsterisk
                value={form.values.phoneNo}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly && form.setFieldValue('phoneNo', e)
                }
                styles={inputStyle}
              />
            </Grid.Col>
          </Grid>

          {/* Button group */}
          {!viewOrUpdate?.isReadOnly && (
            <Flex
              mih={50}
              gap="xs"
              justify="flex-end"
              align="flex-start"
              direction="row"
              wrap="wrap"
              className="mt-5"
            >
              {/* Cancel Button */}
              <Button
                variant="outline"
                autoContrast
                color={theme.colors.secondaryColors[3]}
                size="md"
                onClick={onCloseButton}
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <Text tt="capitalize" fs="italic">
                  {'Cancel'}
                </Text>
              </Button>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="outline"
                autoContrast
                color={theme.colors.primaryColors[0]}
                size="md"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <Text tt="capitalize" fs="italic">
                  {mode === 'Add' ? 'Create' : 'Update'}
                </Text>
              </Button>
            </Flex>
          )}
        </form>
      </div>
    );
  }
);

UserForm.displayName = 'UserForm';
export default UserForm;
