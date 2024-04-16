import { GrPowerReset } from 'react-icons/gr';

const SearchButton = ({
  onSearchButtonClick,
}: {
  onSearchButtonClick: () => void;
}) => {
  return (
    <button
      onClick={onSearchButtonClick}
      className="p-2.5 text-sm font-medium text-white bg-secondaryColors-100 rounded-lg border border-secondaryColors-50 hover:bg-secondaryColors-80 hover:ring-4 hover:outline-none hover:ring-lightColors-lightShade3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:hover:ring-blue-800"
    >
      <svg
        className="w-4 h-3.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
      <span className="sr-only">Search</span>
    </button>
  );
};

export default SearchButton;
