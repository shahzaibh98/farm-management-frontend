import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Grid,
  Input,
  Paper,
  Container,
  Select,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { initialSearchValues } from './initial.values';

import GenericHeader from '../../layout/header.layout';

const FarmForm = () => {
  const initializeStateFromQueryParams = () => {
    const searchValue =
      searchParams.get('searchValue') || initialSearchValues.searchValue;
    const status = searchParams.get('status') || initialSearchValues.status;
    return {
      searchValue,
      status,
    };
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValues, setSearchValues] = useState(
    initializeStateFromQueryParams()
  );
  const theme = useMantineTheme();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNo: '',
      farmTitle: '',
      address: '',
    },
    onSubmit: values => {
      console.log(values);
    },
  });

  const setValuesById = (valuesById: any) =>
    setSearchValues(prevFormValues => ({
      ...prevFormValues,
      ...valuesById,
    }));

  return (
    <main className={`h-screen relative bg-darkColors-700`}>
      <GenericHeader
        headerText="Farm "
        breadcrumbsText="Manage Farm Add Task" // Call handleAddFarmAdmin function when button is clicked
      />
      <Container fluid py-4>
        <Paper shadow="xs" radius="md" style={{ padding: '20px' }}>
          <form onSubmit={formik.handleSubmit}>
            <Text component="h3" fw={550} c={theme.colors.darkColors[0]}>
              Farm Detail
            </Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <label htmlFor="farmTitle">Farm Title *</label>
                <Input
                  id="farmTitle"
                  name="farmTitle"
                  placeholder="Enter farm title"
                  value={formik.values.farmTitle}
                  onChange={formik.handleChange}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <label htmlFor="address">Address *</label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </Grid.Col>
            </Grid>

            <Text
              component="h3"
              style={{
                marginTop: '2rem',
                marginBottom: '1rem',
                fontWeight: 700,
              }}
            >
              User Detail
            </Text>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <label htmlFor="name">Name *</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <label htmlFor="email">Email *</label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <label htmlFor="phoneNo">Phone Number *</label>
                <Input
                  id="phoneNo"
                  name="phoneNo"
                  placeholder="Enter phone number"
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <label htmlFor="status">Status *</label>
                <Select
                  id="status"
                  placeholder="Status"
                  data={['Active', 'Blocked']}
                  value={searchValues.status ?? ''}
                  onChange={value => setValuesById({ status: value })}
                />
              </Grid.Col>
            </Grid>

            <Button
              type="submit"
              variant="filled"
              fullWidth
              style={{ marginTop: '2rem' }}
            >
              Create
            </Button>
          </form>
        </Paper>
      </Container>
    </main>
  );
};

export default FarmForm;
