import { MdContentCopy } from "react-icons/md";

interface accountProps {
  label: string,
  code: number,
}

const AccountView: React.FC<accountProps> = ({ label, code }) => {
  return (
    <div className="bg-base-100 border p-2 rounded">
      <p className="text-sm">{label}</p>
      <div className="flex items-baseline">
        <p className="text-4xl mt-1">{code}</p>
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
