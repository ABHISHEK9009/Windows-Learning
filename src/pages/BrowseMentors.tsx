import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Code, BarChart3, Palette, TrendingUp, Briefcase, PenTool } from 'lucide-react';
import { mentors, categories } from '@/data/mockData';
import MentorCard from '@/components/MentorCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const iconMap: Record<string, React.ElementType> = {
  Code, BarChart3, Palette, TrendingUp, Briefcase, PenTool,
};

const BrowseMentors = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mentors.filter((m) => {
      const matchesQuery = !query || m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.expertise.some(e => e.toLowerCase().includes(query.toLowerCase())) ||
        m.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !selectedCategory || m.categoryId === selectedCategory;
      const matchesPrice =
        priceRange === 'all' ? true :
        priceRange === 'low' ? m.hourlyRate <= 1200 :
        priceRange === 'mid' ? m.hourlyRate > 1200 && m.hourlyRate <= 2000 :
        m.hourlyRate > 2000;
      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [query, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Find your mentor</h1>
            <p className="text-muted-foreground">Browse {mentors.length} verified experts across {categories.length} skill categories</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, skill, or title..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 h-11 px-4 rounded-lg border text-sm font-medium"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-52 shrink-0 space-y-6`}>
              <div>
                <h4 className="text-sm font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block text-sm w-full text-left px-3 py-1.5 rounded-md transition-colors ${
                      !selectedCategory ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => {
                    const Icon = iconMap[cat.icon] || Code;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 text-sm w-full text-left px-3 py-1.5 rounded-md transition-colors ${
                          selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <Icon className="h-4 w-4" /> {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all' as const, label: 'All Prices' },
                    { value: 'low' as const, label: '₹500 - ₹1,200/hr' },
                    { value: 'mid' as const, label: '₹1,200 - ₹2,000/hr' },
                    { value: 'high' as const, label: '₹2,000+/hr' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setPriceRange(option.value)}
                      className={`block text-sm w-full text-left px-3 py-1.5 rounded-md transition-colors ${
                        priceRange === option.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-4">{filtered.length} mentor{filtered.length !== 1 ? 's' : ''} found</p>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((mentor, i) => (
                    <MentorCard key={mentor.id} mentor={mentor} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg font-medium mb-2">No mentors found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseMentors;
