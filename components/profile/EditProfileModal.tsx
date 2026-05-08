import DeveloperProfileForm from "../forms/DeveloperProfileForm";
import FounderProfileForm from "../forms/FounderProfileForm";
import { Button } from "../ui/button";

type Props = {
  role: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditProfileModal({
  role,
  onClose,
  onSuccess,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-start px-8 py-6 border-b border-gray-100">
          <div className="flex-1">
            <h2 className="text-2xl font-light tracking-tight text-gray-900">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {role === "developer" ? "Developer" : "Founder"} Profile
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="ml-4 p-2 rounded-lg transition-colors duration-200 h-auto w-auto bg-transparent hover:bg-gray-100 text-gray-600"
          >
            ✕
          </Button>
        </div>
        <div className="px-8 py-6">
          {
            role === "developer" ? (
              <DeveloperProfileForm onSuccess={onSuccess} />
            ) : (
              <FounderProfileForm onSuccess={onSuccess} />
            )
          }
        </div>
      </div>
    </div>
  );
}