import { CommonResponse } from "@interfaces/index";

const fetcher = async <I, O>(
  url: string,
  method: string,
  input?: I,
): Promise<CommonResponse<O | string>> => {
  try {
    const headers = new Headers({
      "Content-Type": "application/json"
    });
    const token = localStorage.getItem(process.env.tokenKey || "");
    if (token) {
      headers.append("authorization", `Bearer ${token}`);
    }
    const options: RequestInit = {
      method,
      headers,
      credentials: "same-origin",
    };
    if (method === "POST") {
      if (input) {
        options.body = JSON.stringify(input);
      } else {
        options.body = JSON.stringify({});
      }
    }
    const res = await fetch(url, options);
  
    return await res.json();
  } catch (err) {
    return {
      status: "FAILED",
      data: "Network Called Failed",
    };
  }
};

export default fetcher;
