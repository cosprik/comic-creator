import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [comicText, setComicText] = useState(Array(10).fill(""));
  const [comicImages, setComicImages] = useState(Array(10).fill(""));
  const [loading, setLoading] = useState(false);
  const handleTextChange = (index, value) => {
    const newText = [...comicText];
    newText[index] = value;
    setComicText(newText);
  };

  const generateComic = async () => {
    setLoading(true);
    // Implement API call using the provided query function
    // Update the API key and endpoint accordingly
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const images = await Promise.all(
      comicText.map(async (text) => {
        const startTime = new Date();
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "image/png",
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        });
        const imageUrl = URL.createObjectURL(await response.blob());
        const endTime = new Date();
        console.log(imageUrl, `Time Required: ${endTime - startTime}`);
        return imageUrl;
      })
    );

    // Display the generated comic images
    setComicImages(images);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <Head>
        <title>Comic Creator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-8 text-center">Comic Creator</h1>

      {/* Warning messages */}
      <div className="bg-yellow-200 p-4 mb-8">
        <p className="text-yellow-800 font-bold">
          Warning: Under normal circumstances, the server is expected to
          generate an image within approximately 30 seconds for each request.
        </p>
        <p className="text-yellow-800">
          Please note that the initial request might sometimes take longer,
          potentially up to 10 minutes. This delay is due to the server's
          warm-up time. Subsequent requests will process at the standard rate.
        </p>
      </div>

      <form className="mb-8 grid md:grid-cols-2 gap-x-6 gap-y-2">
        {comicText.map((text, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Panel {index + 1}
            </label>
            <input
              type="text"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={generateComic}
          className="bg-blue-500 text-white p-2 rounded-full md:col-span-2 mx-auto px-8"
          disabled={loading || comicText.filter((item) => item).length <= 0}
        >
          {loading ? "Generating Comic..." : "Generate Comic"}
        </button>
      </form>

      {/* Display the generated comic images */}
      {/* For simplicity, display the URLs. In a real app, update the UI accordingly */}
      {comicImages.filter((item) => item).length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Generated Comic:</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {comicImages?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Comic Panel ${index + 1}`}
                className="mb-4"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
