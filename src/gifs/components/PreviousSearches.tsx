import type { FC } from "react";

interface PreviousSearchesProps {
  searches: string[];
  onlabelClicked: (term: string) => void;
}

/**
 * Muestra el historial de términos de búsqueda previos
 */
export const PreviousSearches: FC<PreviousSearchesProps> = ({
  searches,
  onlabelClicked,
}) => {
  return (
    <div className="previous-searches">
      <h2>Búsquedas previas</h2>
      <ul className="previous-searches-list">
        {searches.map((search) => (
          <li key={search} onClick={() => onlabelClicked(search)}>
            {search}
          </li>
        ))}
      </ul>
    </div>
  );
};
