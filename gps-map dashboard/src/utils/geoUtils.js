export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

export const reverseGeocode = async (lat, lon) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CloudSenseAppReact/1.0 (contact@example.com)'
      }
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      const address = data.address || {};
      const place = address.amenity ||
                    address.building ||
                    address.shop ||
                    address.office ||
                    address.tourism ||
                    address.leisure ||
                    address.suburb ||
                    address.neighbourhood ||
                    address.hamlet ||
                    address.city ||
                    address.town ||
                    address.village ||
                    address.county ||
                    (data.display_name ? data.display_name.split(',')[0] : 'Unknown');
                    
      return {
        place: place || 'Unknown',
        state: address.state || 'Unknown',
        country: address.country || 'Unknown',
      };
    } else {
      return { place: 'Unknown', state: 'Unknown', country: 'Unknown' };
    }
  } catch (e) {
    clearTimeout(timeoutId);
    console.error('Error during reverse geocoding:', e.name === 'AbortError' ? 'Timeout' : e);
    return { place: 'Unknown', state: 'Unknown', country: 'Unknown' };
  }
};

export const geocode = async (query) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CloudSenseAppReact/1.0 (contact@example.com)'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0 && data[0].lat && data[0].lon) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
    }
    return null;
  } catch (e) {
    clearTimeout(timeoutId);
    console.error('Error during geocoding:', e.name === 'AbortError' ? 'Timeout' : e);
    return null;
  }
};
