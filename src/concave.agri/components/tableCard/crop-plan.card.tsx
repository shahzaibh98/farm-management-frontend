import { IconCalendarMonth } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const CropCalenderCard = ({ cropImage, title, date, uses, link }: any) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/crop-plan/${link}/planning`);
      }}
      className="border border-solid border-[#c6d6cd] flex items-center p-3 h-28 bg-white rounded-md shadow-lg cursor-pointer transition-transform hover:scale-105 hover:border hover:border-solid hover:border-[#0F783B]"
    >
      <div className="w-[94px] h-[76px]">
        <img
          src={cropImage}
          alt="Crops_Icon"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <section className="block border-l border-gray-300 m-3">
        <div className="pl-3">
          <h3 className="text-[#000000] text-opacity-30 text-[11px] font-montserrat font-semibold">
            {date}
          </h3>
          <h3 className="font-montserrat font-semibold text-[#0F783B] text-[14px]">
            {title}
          </h3>
        </div>
        <div className="flex gap-3 pt-2 pl-3">
          <IconCalendarMonth size={18} className="text-gray-500" />
          <p className="text-[#BE8B45] text-[12px] font-montserrat font-semibold">
            Records :{' '}
          </p>
          <p className="text-[#0F783B] text-[12px] font-montserrat font-semibold">
            {uses}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CropCalenderCard;
