import { Breadcrumbs as MantineBreadCrumbs, Anchor } from '@mantine/core';
interface IBreadCrumbs {
  title: string;
  href: string;
}
const BreadCrumbs = (breadCrumbsData: IBreadCrumbs[]) => {
  const items = breadCrumbsData?.map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));
  return <MantineBreadCrumbs>{items}</MantineBreadCrumbs>;
};

export default BreadCrumbs;
