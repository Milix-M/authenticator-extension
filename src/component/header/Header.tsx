import { FiPlusSquare } from "react-icons/fi";
import { LuQrCode, LuSettings } from "react-icons/lu";

const Header = () => {
  return (
    <div className="py-3 px-4 w-full flex items-center justify-between bg-base-100 border-b">
      <div className="flex space-x-2">
        {/* gear icon */}
        <LuSettings className="w-5 h-5 hover:cursor-pointer" />
        <div className="w-5 h-5"></div>
      </div>
      <p className="text-center text-base font-bold">Authenticator</p>
      <div className="flex space-x-2">
        {/* Add icon */}
        <FiPlusSquare className="w-5 h-5 hover:cursor-pointer" />
        {/* QRCode icon */}
        <LuQrCode className="w-5 h-5 hover:cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
