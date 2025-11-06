import { useState } from "react";
import { useTranslation } from "react-i18next";
import DynamicSearch from "@/components/dynamic-search";
import ConnectionStatus from "@/components/ConnectionStatus";
import { useGetTrendingContentQuery } from "@/store/features/api/searchApi";

export default function Search() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'top' | 'images' | 'songs' | 'artists'>('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch trending content based on active tab and search query
  const { 
    data: trendingData, 
    isLoading, 
    error 
  } = useGetTrendingContentQuery({
    page: 1, 
    limit: 10, 
    type: activeTab,
    search: hasSearched ? searchQuery : '' // Only use search query if user has actually searched
  });

  // Handle search input change (for display only)
  const handleSearchInputChange = (query: string) => {
    setSearchInputValue(query);
    // If user clears the input, reset search state
    if (query === '') {
      setSearchQuery('');
      setHasSearched(false);
    }
  };

  // Handle search (when Enter is pressed)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setHasSearched(false);
    } else {
      setHasSearched(true);
    }
    // The trending content will automatically refetch with the new search query
  };

  // Handle tab change with search query
  const handleTabChange = (tab: 'top' | 'images' | 'songs' | 'artists') => {
    setActiveTab(tab);
    // If there's a search query, it will automatically be used in the API call
  };

  // Mock real-time data states (keeping original UI elements)
  const updateCount = 1;

  // Redirect to home if not authenticated (keeping original logic)
  // if (isFetching) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500" />
  //     </div>
  //   );
  // }


  // Interface de recherche avec données statiques (keeping all UI elements)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            {t('searchPage.discoverArtists')}
          </h1>
          {/* <ConnectionStatus className="flex items-center space-x-2" /> */}
        </div>

        {/* Indicateur temps réel (keeping original UI element but with static data) */}
        
        {/* <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm">
            🔄 Données mises à jour en temps réel • {updateCount} mises à jour
            reçues
          </p>
        </div> */}
      </div>

      {/* Composant de recherche dynamique avec artistes */}
      <DynamicSearch 
        userRole="fan"
        trendingData={trendingData}
        isLoading={isLoading}
        error={error}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        onSearchInputChange={handleSearchInputChange}
        searchInputValue={searchInputValue}
        hasSearched={hasSearched}
        searchQuery={searchQuery}
      />
    </div>
  );
}
