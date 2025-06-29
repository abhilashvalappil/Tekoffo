import React, { useState, useEffect } from 'react';
import { Plus, Pencil, MoreVertical } from 'lucide-react';
import { addCategory, fetchCategories, updateCategoryStatus, updateCategory } from '../../api/admin';
import { Toaster, toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema,CategoryFormData } from '../../utils/validations/CategoryValidation';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { handleApiError } from '../../utils/errors/errorHandler';
import { useDebounce } from '../../hooks/customhooks/useDebounce';


interface Category {
  _id?: string;
  // catId: string;
  name: string;
  subCategories: string[];
  isListed: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
  category?: Category;
  mode: 'add' | 'edit';
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      subcategories: '',
    },
  });

  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (category && mode === 'edit') {
      reset({
        name: category.name,
        subcategories: category.subCategories.join(', '),
      });
    } else {
      reset({
        name: '',
        subcategories: '',
      });
    }
  }, [category, mode, isOpen, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setServerError('');
    const categoryData: Partial<Category> = {
      _id: mode === 'edit' ? category?._id : undefined,
      name: data.name,
      subCategories: data.subcategories
      .split(',')
      .map((sub) => sub.trim())
      .filter((sub) => sub.length > 0),
    };

    const toastId = toast.loading(mode === 'add' ? 'Adding category...' : 'Updating category...');
    try {
      if (mode === 'add') {
        await addCategory(categoryData);
        toast.success('Category added successfully', { id: toastId });
      } else {
        await updateCategory(categoryData);
        toast.success('Category updated successfully', { id: toastId });
      }
      onSave(categoryData);
      onClose();
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage, { id: toastId });
      setServerError(errorMessage);
      console.error('Error saving category:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="p-5 absolute inset-0 z-50 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {mode === 'add' ? 'Add New Category' : 'Edit Category'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                {...register('name')}
                onChange={() => {
                  setServerError('');
                  // setValue('name', e.target.value);  
                }}
                className={`w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategories (comma-separated)
              </label>
              <input
                type="text"
                {...register('subcategories')}
                placeholder="e.g., Frontend, Backend, Full Stack"
                className={`w-full px-3 py-2 border ${
                  errors.subcategories ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.subcategories && (
                <p className="text-red-500 text-sm mt-1">{errors.subcategories.message}</p>
              )}
            </div>
            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setServerError('');
                  onClose();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {mode === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 6,
  });
  const [searchQuery, setSearchQuery] = useState('');
  // const [sortOption, setSortOption] = useState<'name-asc' | 'name-desc' | 'status-asc' | 'status-desc'>('name-asc');
  const [sortOption, setSortOption] = useState<string>();
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedData = await fetchCategories(pagination.page, pagination.limit,debouncedSearchTerm);
        setCategories(fetchedData.data);
        setPagination((prev) => ({
          ...prev,
          total: fetchedData.meta.total,
          pages: fetchedData.meta.pages,
        }));
      } catch (error) {
        const errormessage = handleApiError(error)
        setError(errormessage);
        toast.error(errormessage);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [pagination.page, pagination.limit,debouncedSearchTerm]);

  const handleAddCategory = () => {
    setModalMode('add');
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (modalMode === 'add') {
      const newCategory: Category = {
        _id: categoryData._id,
        // catId: Date.now().toString(),
        name: categoryData.name!,
        subCategories: categoryData.subCategories!,
        isListed: true,
      };
      setCategories([...categories, newCategory]);
    } else {
      setCategories(
        categories.map((cat) =>
          cat._id === categoryData._id
            ? { ...cat, name: categoryData.name!, subCategories: categoryData.subCategories! }
            : cat
        )
      );
    }
    setIsModalOpen(false);
  };

  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      const currentCategory = categories.find((cat) => cat._id === categoryId);
      if (!currentCategory) throw new Error('Category not found');

      const newStatus = !currentCategory.isListed;

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, isListed: newStatus } : cat
        )
      );

      const updatedStatus = await updateCategoryStatus(categoryId, newStatus);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, isListed: updatedStatus.isListed } : cat
        )
      );

      toast.success(`Category ${newStatus ? 'listed' : 'unlisted'} successfully`);
    } catch (error) {
      toast.error(handleApiError(error));
      console.error('Error toggling category status:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const filteredAndSortedCategories = categories
    // .filter((category) =>
    //   category.name.toLowerCase().includes(searchQuery.toLowerCase())
    // )
    .sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'status-asc':
          return a.isListed === b.isListed ? 0 : a.isListed ? -1 : 1;
        case 'status-desc':
          return a.isListed === b.isListed ? 0 : a.isListed ? 1 : -1;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="fixed top-0 w-full z-50 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-screen bg-gray-300">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="mt-15 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-1xl font-bold text-gray-900">Categories</h5>
                <button
                  onClick={handleAddCategory}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add Category
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search by category name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-1/2"
                />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as string)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="status-asc">Status (Listed First)</option>
                  <option value="status-desc">Status (Unlisted First)</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedCategories.map((category) => (
                      <tr key={category._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {category.subCategories.map((sub, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {sub}
                              </span>
                            )) || 'No subcategories'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleCategoryStatus(category._id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg text-white ${
                              category.isListed
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {category.isListed ? 'Listed' : 'Unlisted'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Pencil size={20} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
 
            </div>
          </div>
          <Stack spacing={2} alignItems="center" className="mt-4">
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(event, value) => handlePageChange(value)}
              color="primary"
            />
          </Stack>
        </div>
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
          category={selectedCategory}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default CategoryManagement;