import { GrPowerReset } from 'react-icons/gr';

const ResetButton = ({
  onResetButtonClick,
}: {
  onResetButtonClick: () => void;
}) => {
  return (
    <button
      onClick={onResetButtonClick}
      className="ml-4 p-2.5 text-sm font-medium text-white bg-red-light rounded-lg border border-1 border-red hover:ring-2 hover:outline-none hover:ring-red"
    >
      <GrPowerReset color="#B71C1C" />
      <span className="sr-only">Clear</span>
    </button>
  );
};

export default ResetButton;
