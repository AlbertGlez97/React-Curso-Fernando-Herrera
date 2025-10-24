import { GifList } from "./gifs/components/GifList";
import { PreviousSearches } from "./gifs/components/PreviousSearches";
import { useGifs } from "./gifs/hooks/useGifs";
import { CustomHeader } from "./shared/components/CustomHeader";
import { SearchBar } from "./shared/components/SearchBar";

export const GifsApp = () => {
  const {
    //Properties
    previousTerms,
    gifs,

    //Methods / Actions
    handleTermClicked,
    handleSearch,
  } = useGifs();

  return (
    <>
      <CustomHeader
        title="Buscador de Gifs"
        description="Descubre y comparte el Gif perfecto"
      />

      <SearchBar placeholder="Buscar gifs..." onQuery={handleSearch} />

      <PreviousSearches
        searches={previousTerms}
        onlabelClicked={handleTermClicked}
      />

      <GifList gifs={gifs} />
    </>
  );
};
