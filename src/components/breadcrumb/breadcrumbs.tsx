import { Breadcrumbs, Anchor } from '@mantine/core';
interface IBreadCrumbs {
  title: string;
  href: string;
}
const CustomBreadCrumbs = (breadCrumbsData: IBreadCrumbs[]) => {
  const items = breadCrumbsData?.map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));
  return <Breadcrumbs>{items}</Breadcrumbs>;
};

export default CustomBreadCrumbs;
