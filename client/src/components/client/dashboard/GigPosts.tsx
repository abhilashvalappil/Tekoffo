import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  DollarSign,
  Verified,
  List,
  Grid
} from 'lucide-react';

// Define interface for Seller Profile
interface SellerProfile {
  id: number;
  name: string;
  username: string;
  avatar: string;
  headline: string;
  location: string;
  level: 'New' | 'Level 1' | 'Level 2' | 'Top Rated';
  languages: string[];
  responseTime: string;
  responseRate: number;
}

// Define comprehensive interface for Gig data
interface Gig {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  revisions: number;
  deliveryTime: number;
  skills: string[];
  requirements: string[];
  rating: number;
  reviewCount: number;
  seller: SellerProfile;
}

// Sample gig data (would typically come from an API)
const sampleGigs: Gig[] = [
  {
    id: 1,
    title: 'Professional React Web Application Development',
    description: 'Comprehensive React web application development with modern best practices, responsive design, and optimal performance. I will create scalable, efficient, and user-friendly web solutions tailored to your specific business needs.',
    category: 'Web Development',
    price: 599,
    revisions: 3,
    deliveryTime: 7,
    skills: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Next.js'],
    requirements: [
      '3+ years of React development experience',
      'Strong understanding of modern JavaScript',
      'Experience with state management',
      'Portfolio of previous projects'
    ],
    rating: 4.8,
    reviewCount: 42,
    seller: {
      id: 101,
      name: 'Alex Rodriguez',
      username: 'dev_alex',
      avatar: '/api/placeholder/100/100',
      headline: 'Senior Full-Stack Developer | React & Node.js Expert',
      location: 'San Francisco, CA',
      level: 'Top Rated',
      languages: ['English', 'Spanish'],
      responseTime: '1 hour',
      responseRate: 98
    }
  },
  {
    id: 2,
    title: 'Creative Brand Identity Design Package',
    description: 'Complete branding solution including logo design, brand guidelines, business card, and social media templates. Crafting unique visual identities that tell your brand\'s story and stand out in the market.',
    category: 'Graphic Design',
    price: 349,
    revisions: 2,
    deliveryTime: 5,
    skills: ['Adobe Illustrator', 'Photoshop', 'Brand Identity', 'Logo Design'],
    requirements: [
      'Proven experience in brand identity design',
      'Strong portfolio showcasing creative work',
      'Understanding of modern design trends',
      'Ability to create versatile brand assets'
    ],
    rating: 4.9,
    reviewCount: 35,
    seller: {
      id: 102,
      name: 'Emma Thompson',
      username: 'design_emma',
      avatar: '/api/placeholder/100/100',
      headline: 'Award-Winning Graphic Designer | Branding Specialist',
      location: 'New York, NY',
      level: 'Level 2',
      languages: ['English', 'French'],
      responseTime: '2 hours',
      responseRate: 95
    }
  },
  {
    id: 3,
    title: 'Technical Content Writing for Tech Blogs',
    description: 'In-depth, SEO-optimized technical content writing for technology and software development blogs. Delivering precise, engaging, and informative articles that showcase your expertise and drive organic traffic.',
    category: 'Content Writing',
    price: 199,
    revisions: 1,
    deliveryTime: 3,
    skills: ['Technical Writing', 'SEO', 'Content Strategy', 'Tech Blogging'],
    requirements: [
      'Strong technical writing background',
      'Deep understanding of technology topics',
      'Excellent grammar and research skills',
      'Ability to explain complex concepts clearly'
    ],
    rating: 4.7,
    reviewCount: 28,
    seller: {
      id: 103,
      name: 'Jordan Kim',
      username: 'tech_writer_jordan',
      avatar: '/api/placeholder/100/100',
      headline: 'Tech Content Expert | Published Technical Writer',
      location: 'Remote',
      level: 'Level 1',
      languages: ['English', 'Korean'],
      responseTime: '4 hours',
      responseRate: 90
    }
  }
];

const FreelancerGigsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Star rating component
  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
      <div className="flex items-center text-yellow-500">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            size={16} 
            fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
            className={index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-gray-600 text-sm">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Seller Level Badge
  const SellerLevelBadge: React.FC<{ level: SellerProfile['level'] }> = ({ level }) => {
    const badgeColors = {
      'New': 'bg-gray-200 text-gray-700',
      'Level 1': 'bg-blue-100 text-blue-700',
      'Level 2': 'bg-green-100 text-green-700',
      'Top Rated': 'bg-purple-100 text-purple-700'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badgeColors[level]}`}>
        {level}
      </span>
    );
  };

  // Filter gigs based on search term and category
  const filteredGigs = sampleGigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filteredCategory === '' || gig.category === filteredCategory)
  );

  // Categories for filtering
  const categories = [...new Set(sampleGigs.map(gig => gig.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Tekoffo Freelancer Gigs</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search gigs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        
        {/* Category Filter */}
        <select 
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'} rounded-l-lg border`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'} rounded-r-lg border`}
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {/* Gigs Container */}
      {filteredGigs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No gigs found matching your search.
        </div>
      ) : (
        <div className={
          viewMode === 'list' 
            ? 'space-y-6' 
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }>
          {filteredGigs.map(gig => (
            <div 
              key={gig.id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Seller Profile Section */}
              <div className="flex items-center mb-4 pb-4 border-b">
                {/* Seller Avatar */}
                <div className="mr-4 relative">
                  <img 
                    src={gig.seller.avatar} 
                    alt={gig.seller.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {gig.seller.level === 'Top Rated' && (
                    <Verified 
                      className="absolute bottom-0 right-0 text-blue-500" 
                      size={20} 
                      fill="currentColor"
                    />
                  )}
                </div>

                {/* Seller Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {gig.seller.name}
                    </h3>
                    <SellerLevelBadge level={gig.seller.level} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {gig.seller.headline}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {gig.seller.location}
                  </div>
                </div>
              </div>

              {/* Gig Details */}
              <div className="flex-grow">
                {/* Gig Title */}
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {gig.title}
                </h2>

                {/* Gig Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {gig.description}
                </p>

                {/* Category and Rating */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {gig.category}
                  </span>
                  <div className="flex items-center">
                    <StarRating rating={gig.rating} />
                    <span className="text-sm text-gray-500 ml-2">
                      ({gig.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gig Footer */}
              <div className="border-t pt-4 mt-auto">
                <div className="flex justify-between items-center">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="text-sm font-semibold text-green-700">
                      ${gig.price} Starting Price
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerGigsList;