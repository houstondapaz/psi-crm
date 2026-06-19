const PHOTON_API = "https://photon.komoot.io/api/";
const BRAZIL_BBOX = "-73.99,-33.75,-34.79,5.27";

type PhotonProperties = {
  name?: string;
  street?: string;
  housenumber?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
};

type PhotonFeature = {
  properties: PhotonProperties;
};

type PhotonResponse = {
  features: PhotonFeature[];
};

export type AddressSuggestion = {
  label: string;
};

export function formatPhotonAddress(properties: PhotonProperties): string {
  const streetLine = [properties.street, properties.housenumber]
    .filter(Boolean)
    .join(", ");
  const primary = streetLine || properties.name;
  const locality = [properties.district, properties.city].filter(Boolean).join(", ");
  const region = properties.state;

  return [primary, locality, region].filter(Boolean).join(" - ");
}

export async function searchAddresses(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmed,
    limit: "6",
    bbox: BRAZIL_BBOX,
  });

  const response = await fetch(`${PHOTON_API}?${params.toString()}`);
  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as PhotonResponse;
  const seen = new Set<string>();

  return data.features.flatMap((feature) => {
    const label = formatPhotonAddress(feature.properties);
    if (!label || seen.has(label)) {
      return [];
    }
    seen.add(label);
    return [{ label }];
  });
}
