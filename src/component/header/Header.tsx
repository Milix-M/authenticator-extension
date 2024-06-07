import { BsQrCode } from "react-icons/bs";
import { FaRegSquarePlus } from "react-icons/fa6";
import { GoGear } from "react-icons/go";

const Header = () => {
  return (
    <div className="py-3 px-4 w-full flex items-center justify-between bg-base-100 border-b">
      <div>
        {/* gear icon */}
        <GoGear className="w-4 h-4" />
      </div>
      <p className="text-center text-base">Authenticator</p>
      <div className="flex space-x-2">
        {/* Add icon */}
        <FaRegSquarePlus className="w-4 h-4" />
        {/* QRCode icon */}
        <BsQrCode className="w-4 h-4" />
      </div>
    </div>
  );
};

export default Header;
