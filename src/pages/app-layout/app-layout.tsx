import { Outlet } from 'react-router-dom';
import { Navbar } from '../../layout';

const CustomAppShell = () => {
  return (
    <div className="w-screen h-screen fixed">
      <div className="flex h-full bg-skin-secondary">
        <div className="w-[20%] md:w-[8%] lg:w-[15%] h-full  bg-skin-fill bg-gray-100">
          <Navbar />
        </div>
        <main className="w-[80%] md:w-[92%] lg:w-[85%] h-full bg-skin-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default CustomAppShell;
