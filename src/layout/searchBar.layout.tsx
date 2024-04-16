import React from 'react';
import { Grid } from '@mantine/core'; // Adjust the import path as necessary
import { SearchForm } from '../concave.agri/components';
import { SearchButton } from '../concave.agri/components/searchbar';
import ResetButton from '../concave.agri/components/searchbar/resetButton';
import useScreenSize from '../hooks/useScreenSize';

interface SearchComponentProps {
  searchValue: string;
  setValuesById: (values: { searchValue: string }) => void;
  handleSearchButtonClick: () => void;
  handleResetButtonClick: () => void;
  isSmallScreen: boolean;
}
const SearchComponent = ({
  searchValue,
  setValuesById,
  handleSearchButtonClick,
  handleResetButtonClick,
}: SearchComponentProps) => {
  const { isSmallScreen } = useScreenSize();
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <SearchForm
          id="simple-search"
          placeholder="Search by title..."
          value={searchValue}
          onChange={(event: { target: { value: any } }) =>
            setValuesById({ searchValue: event.target.value })
          }
        />
      </Grid.Col>
      {!isSmallScreen && (
        <Grid.Col span={{ base: 12, md: 6, lg: 1 }}>
          <div className="flex flex-row">
            <SearchButton onSearchButtonClick={handleSearchButtonClick} />
            <ResetButton onResetButtonClick={handleResetButtonClick} />
          </div>
        </Grid.Col>
      )}
    </Grid>
  );
};

export default SearchComponent;
