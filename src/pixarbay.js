export async function fetchImages(searchTerm) {
  const API_KEY = import.meta.env.VITE_PIXARBAY_APIKEY; // Make sure you have your API key configured
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    searchTerm
  )}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (parseInt(data.totalHits) > 0) {
      return data.hits; // Return the hits array
    } else {
      console.log("No hits");
      return []; // Return an empty array if no results
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Throw the error for the caller to handle
  }
}
