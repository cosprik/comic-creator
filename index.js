import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [comicText, setComicText] = useState(Array(10).fill(""));
  const [comicImages, setComicImages] = useState(Array(10).fill(""));
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleTextChange = (index, value) => {
    const newText = [...comicText];
    newText[index] = value;
    setComicText(newText);
  };

  const generateComic = async () => {
    if (comicText.filter((item) => !item).length > 0) {
      alert("Provide inputs in all fields");
      return;
    }
    setLoading(true);
    setFormSubmitted(true);
    setComicImages(Array(10).fill(""));

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const images = [];

    for (let i = 0; i < comicText.length; i++) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "image/png",
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: comicText[i] }),
        });
        const imageUrl = URL.createObjectURL(await response.blob());
        images.push(imageUrl);
        setComicImages(images);
      } catch (error) {
        alert(`Error generating image for panel ${i + 1}:`, error);
        console.error(`Error generating image for panel ${i + 1}:`, error);
        images.push(null);
        setComicImages(images);
      }
    }

    // Display the generated comic images
    setComicImages(images);
    setLoading(false);
  };

  return loading ? (
    <div className="py-4 pt-8 bg-white/80 text-center top-0 left-0 align-middle flex flex-col justify-center items-center">
      <p className="text-blue-500 text-4xl font-bold">
        {loading ? "Generating images..." : "Generated Comic:"}
      </p>
      {/* Display the generated comic images */}
      {comicImages.filter((item) => item).length > 0 && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 m-6">
            {comicImages
              ?.filter((item) => item)
              ?.map((image, index) => (
                <div>
                  <p className="text-small text-center">{comicText[index]}</p>
                  <img
                    key={index}
                    src={image}
                    alt={`Comic Panel ${index + 1}`}
                    className="w-full"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  ) : (
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
      {formSubmitted && comicImages.filter((item) => item).length > 0 && (
        <div>
          <p className="text-3xl font-bold text-center ">Generated Comic:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 m-6 border-2 border-black p-2">
            {comicImages
              ?.filter((item) => item)
              ?.map((image, index) => (
                <div className="border-2 border-black">
                  <p className="text-small text-center">{comicText[index]}</p>
                  <img
                    key={index}
                    src={image}
                    alt={`Comic Panel ${index + 1}`}
                    className="w-full border-t-2 border-t-black"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
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
        <div className="grid md:grid-cols-2 gap-2 md:col-span-2 mx-auto">
          <button
            type="button"
            onClick={generateComic}
            className="bg-blue-500 text-white p-2 rounded-full mx-auto px-8"
            disabled={loading}
          >
            {loading ? "Generating Comic..." : "Generate Comic"}
          </button>
          <button
            type="button"
            onClick={() => {
              setComicText(Array(10).fill(""));
              setComicImages(Array(10).fill(""));
            }}
            className="bg-blue-500 text-white p-2 rounded-full mx-auto px-8"
            disabled={loading || comicText.filter((item) => item).length <= 0}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
