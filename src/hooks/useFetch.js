import { useState, useEffect } from "react";

const useFetch = (url, method = "GET") => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(null);

  const postData = (data) => {
    setOptions({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        let response;
        if (method === "GET") {
          response = await fetch(url);
        } else if (method === "POST" && options) {
          response = await fetch(url, options);
        } else {
          throw new Error("Geçersiz method: " + method);
        }

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        // JSON biçiminde veri kontrolü
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          setIsLoading(false);
          setData(responseData);
        } else {
          throw new Error("Beklenen JSON yanıt alınmadı.");
        }
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        console.log(err);
      }
    };

    fetchData();
  }, [url, options, method]);

  return {
    data,
    isLoading,
    error,
    postData,
  };
};

export default useFetch;
