export const TableColumn = (headerText: string | number | boolean) => {
  return <div>{headerText}</div>;
};

export const TableFirstColumn = (headerText: string | number | boolean) => {
  return <div>{headerText}</div>;
};

export const TableImageAndTextColumn = (
  image: string | null,
  headerText: string | number | boolean
) => {
  return (
    <div>
      <div>{headerText}</div>
      <div>{image}</div>
    </div>
  );
};
