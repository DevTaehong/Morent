import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";

import { GeocodeResult } from "@/lib/interfaces";

type LocationProps = {
  handleLocationSelected?: (location: string) => void;
  onUserInput?: (input: string) => void;
  searchLocation?: string | null;
};

const Location: React.FC<LocationProps> = ({
  handleLocationSelected,
  onUserInput,
  searchLocation,
}) => {
  const onPlaceSelect = (value: GeocodeResult) => {
    if (handleLocationSelected) handleLocationSelected(value.properties.name);
  };

  return (
    <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}>
      <GeoapifyGeocoderAutocomplete
        placeholder="City, airport, address or hotel"
        lang={"en"}
        debounceDelay={500}
        onUserInput={onUserInput}
        value={searchLocation ?? ""}
        placeSelect={onPlaceSelect}
      />
    </GeoapifyContext>
  );
};

export default Location;
