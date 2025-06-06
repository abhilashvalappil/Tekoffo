
import { Gig } from "../../types/gigTypes";  
import { deleteGig } from "../../api"; 
import { handleApiError } from "../../utils/errors/errorHandler";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";


interface GigHandlersProps {
  gigs: Gig[];
  gigToDelete: Gig | null;
  setGigs: React.Dispatch<React.SetStateAction<Gig[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGig: React.Dispatch<React.SetStateAction<Gig | null>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGigToDelete: React.Dispatch<React.SetStateAction<Gig | null>>;
  navigate: NavigateFunction;
}

export const createGigHandlers = ({
  gigs,
  gigToDelete,
  setGigs,
  setIsModalOpen,
  setSelectedGig,
  setIsDeleteModalOpen,
  setGigToDelete,
  navigate,
}: GigHandlersProps) => {
  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleDeleteGig = async () => {
    if (!gigToDelete) return;

    try {
      const message = await deleteGig(gigToDelete._id);
      setGigs(gigs.filter((g) => g._id !== gigToDelete._id));
      setIsDeleteModalOpen(false);
      setGigToDelete(null);
      toast.success(message);
      setTimeout(() => {
        navigate("/freelancer/gigs");
      }, 1000);
    } catch (error) {
      toast.error(handleApiError(error));
      setIsDeleteModalOpen(false);
      setGigToDelete(null);
    }
  };

  const handleSaveGig = async (updatedGig: Gig) => {
    try {
      setGigs(gigs.map((g) => (g._id === updatedGig._id ? updatedGig : g)));
    } catch (error) {
      console.error("Failed to update gig:", error);
    }
  };

  return {
    handleEditGig,
    handleDeleteGig,
    handleSaveGig,
  };
};