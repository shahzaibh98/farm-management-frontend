// Importing Mantine library components
import { Grid } from '@mantine/core';

// Importing custom components
import { SearchForm } from '../concave.agri/components'; // SearchForm component for the search input
import { SearchButton } from '../concave.agri/components/searchbar'; // SearchButton component for the search button
import ResetButton from '../concave.agri/components/searchbar/resetButton'; // ResetButton component for the reset button

// Importing custom hooks
import useScreenSize from '../hooks/useScreenSize'; // Hook to determine the screen size

// Interface defining the props for the SearchComponent
interface SearchComponentProps {
  searchValue: string; // The current search value
  setValuesById: (values: { searchValue: string }) => void; // Function to update search values
  handleSearchButtonClick: () => void; // Function to handle search button click
  handleResetButtonClick: () => void; // Function to handle reset button click
}
const SearchComponent = ({
  searchValue,
  setValuesById,
  handleSearchButtonClick,
  handleResetButtonClick,
}: SearchComponentProps) => {
  // Get the screen size information using the custom hook
  const { isSmallScreen } = useScreenSize();

  return (
    <Grid>
      {/* Search input field */}
      <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <SearchForm
          id="simple-search"
          placeholder="Search by title..."
          value={searchValue}
          // Update the search value when the input changes
          onChange={(event: { target: { value: any } }) =>
            setValuesById({ searchValue: event.target.value })
          }
        />
      </Grid.Col>

      {/* Conditionally render search and reset buttons based on screen size */}
      {!isSmallScreen && (
        <Grid.Col span={{ base: 12, md: 6, lg: 1 }}>
          <div className="flex flex-row">
            {/* Search button */}
            <SearchButton onSearchButtonClick={handleSearchButtonClick} />
            {/* Reset button */}
            <ResetButton onResetButtonClick={handleResetButtonClick} />
          </div>
        </Grid.Col>
      )}
    </Grid>
  );
};

// Export the SearchComponent as default
export default SearchComponent;
