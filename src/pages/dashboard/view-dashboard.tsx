import React from 'react';
import { Container, Paper, Title, Text } from '@mantine/core';
import { dataArea, data, dataRadar } from './data';
import { AreaChart, BarChart, RadarChart } from '@mantine/charts';

const DemoDashboard = () => {
  return (
    <Container size="xl">
      {/* Navigation Header */}
      <Title order={1} style={{ marginBottom: '2rem', align: 'center' }}>
        Farm Management Dashboard
      </Title>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
      >
        {/* Summary Cards */}
        <Paper shadow="xs" radius="md" style={{ padding: 'lg' }}>
          <Title order={2} className="mb-2">
            Summary
          </Title>
          <Text>Crop Yield: 1000 tons</Text>
          <Text>Revenue: PKR 00000</Text>
          <Text>Expenses: PKR 00000</Text>
        </Paper>

        {/* Area Chart */}
        <Paper shadow="xs" radius="md" style={{ padding: 'lg' }}>
          <Title order={2} className="mb-2">
            Crop Yield Over Time
          </Title>
          <AreaChart
            h={300}
            data={dataArea}
            dataKey="date"
            type="percent"
            series={[
              { name: 'Apples', color: 'indigo.6' },
              { name: 'Oranges', color: 'blue.6' },
              { name: 'Tomatoes', color: 'teal.6' },
            ]}
          />
        </Paper>

        {/* Bar Chart */}
        <Paper shadow="xs" radius="md" style={{ padding: 'lg' }}>
          <Title order={2} className="mb-2">
            Crop Comparison
          </Title>
          <BarChart
            h={300}
            data={data}
            dataKey="month"
            series={[
              { name: 'Rice', color: 'violet.6' },
              { name: 'Wheat', color: 'blue.6' },
              { name: 'Potato', color: 'teal.6' },
            ]}
            tickLine="y"
          />
        </Paper>
        <Paper shadow="xs" radius="md" style={{ padding: 'lg' }}>
          <Title order={2} className="mb-2">
            LiveStock Comparison
          </Title>
          <RadarChart
            h={300}
            data={dataRadar}
            dataKey="product"
            withPolarRadiusAxis
            series={[{ name: 'sales', color: 'blue.4', opacity: 0.2 }]}
          />
        </Paper>
      </div>
    </Container>
  );
};

export default DemoDashboard;
