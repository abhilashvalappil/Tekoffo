import { useState, useEffect } from 'react';
import { Gig } from '../../../../types/gigTypes';
import { updateGig } from '../../../../api';
import { handleApiError } from '../../../../utils/errors/errorHandler';
import toast from 'react-hot-toast';
import Button from '../../../common/Button';


interface EditGigModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGig: Gig) => void;
}

const EditGigModal: React.FC<EditGigModalProps> = ({ gig, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Gig | null>(gig);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(gig);
  }, [gig]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
        const message = await updateGig(formData._id,formData)
        toast.success(message)
        onSave(formData);
    setTimeout(() => {
      onClose();
      setIsLoading(false);
    }, 1000);
    } catch (error) {
        toast.error(handleApiError(error))
        setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'skills' | 'requirements'
  ) => {
    const value = e.target.value;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]:
              field === 'skills'
                ? value.split(',').map((s) => s.trim()).filter(Boolean)
                : value.split('\n').filter(Boolean),
          }
        : null
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Gig</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => handleArrayChange(e, 'skills')}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Requirements (one per line)</label>
              <textarea
                name="requirements"
                value={formData.requirements.join('\n')}
                onChange={(e) => handleArrayChange(e, 'requirements')}
                className="w-full p-2 border rounded-lg"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Time</label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Revisions</label>
              <input
                type="number"
                name="revisions"
                value={formData.revisions}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGigModal;