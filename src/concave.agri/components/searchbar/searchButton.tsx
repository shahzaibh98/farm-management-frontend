import { GrPowerReset } from 'react-icons/gr';

const SearchButton = ({
  onSearchButtonClick,
}: {
  onSearchButtonClick: () => void;
}) => {
  return (
    <button
      onClick={onSearchButtonClick}
      className="p-2.5 text-sm font-medium text-white bg-[#e3f3e1] rounded-lg border border-[#0F783B] hover:bg-[#e6fef0] hover:ring-4 hover:outline-none hover:ring-[#e6fef0]"
    >
      <svg
        className="w-4 h-3.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="#0F783B"
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
