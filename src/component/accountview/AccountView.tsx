import { MdContentCopy } from "react-icons/md";

const AccountView = () => {
  return (
    <div className="bg-base-100 border p-2 rounded">
      <p className="text-sm">Twitter @hirakegoma</p>
      <div className="flex items-baseline">
        <p className="text-4xl mt-1">123 456</p>
        {/* copy icon */}
        <MdContentCopy className="w-4 h-4 ml-1"/>

        {/* time counter */}
        <div
          className="radial-progress bg-base-300 ml-auto"
          style={{ ["--value" as any]: 70, ["--size" as any]: "1.8em" }}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

export default AccountView;
