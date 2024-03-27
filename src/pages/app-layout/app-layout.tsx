import { Outlet } from 'react-router-dom';
import { Navbar } from '../../layout';
import {
  Burger,
  Group,
  AppShell as MantineAppShell,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function AppShell() {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  return (
    <MantineAppShell
      withBorder={false}
      header={{ height: { base: 48, sm: 60, lg: 0, md: 0 } }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      transitionDuration={500}
      transitionTimingFunction="ease"
    >
      <MantineAppShell.Header color={theme.colors.secondaryColors[3]}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar>
        <Navbar />
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
export default AppShell;
