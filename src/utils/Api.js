import axios from "axios";
import { getFromDB, deleteFromDB } from "@/utils/indexedDB";
import ToastTemplates from "@/components/core/common/toast/ToastTemplates";
import { getTenant } from "./tenant";

const djangoPort = process.env.NEXT_PUBLIC_DJANGO_PORT;

let apiUrl = "";

if (typeof window !== "undefined") {
  const nextJsRootUrl = window.location.origin;
  const hasPort = window.location.port;

  if (hasPort) {
    apiUrl = `${nextJsRootUrl.replace(window.location.port, djangoPort)}/apis`;
  } else {
    const protocol = nextJsRootUrl.startsWith("https://") ? "https" : "http";
    const domain = nextJsRootUrl.replace(/^https?:\/\//, "").split("/")[0];
    apiUrl = `${protocol}://${domain}/apis`;
  }
} else {
  apiUrl = `http://localhost:${djangoPort}/apis`;
}

const formatUrl = (url) => (url.endsWith("/") ? url : url + "/");

const handle403Error = async () => {
  if (window.location.pathname !== "/403") {
    window.location.href = "/403";
  }
};
const handle401Error = async () => {
  await deleteTokenFromDB();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const deleteTokenFromDB = async () => {
  await deleteFromDB("authToken");
};

let requestQueue = [];
let requestInProgress = false;

const urlLastProcessed = new Map();

const processQueue = () => {
  if (requestQueue.length === 0 || requestInProgress) return;

  const urlCount = {};

  requestQueue.forEach((request) => {
    const requestUrl = request.requestFunc.getUrl;
    urlCount[requestUrl] = (urlCount[requestUrl] || 0) + 1;
  });

  Object.entries(urlCount).forEach(([url, count]) => {
    if (count > 900) {
      console.error(
        `Requests for URL ${url} exceeded the allowed limit. All similar requests were killed.`
      );
      requestQueue = requestQueue.filter(
        (request) => request.requestFunc.getUrl !== url
      );
    }
  });

  const { requestFunc, resolve, reject } = requestQueue.shift();
  const requestUrl = requestFunc.getUrl;

  const currentTime = Date.now();
  const lastProcessedTime = urlLastProcessed.get(requestUrl) || 0;

  if (currentTime - lastProcessedTime < 100) {
    requestQueue.push({ requestFunc, resolve, reject });
    setTimeout(processQueue, 100 - (currentTime - lastProcessedTime));
    return;
  }

  urlLastProcessed.set(requestUrl, currentTime);

  requestInProgress = true;

  requestFunc()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      requestInProgress = false;

      if (requestQueue.length > 0) {
        setTimeout(processQueue, 33);
      }
    });
};

const enqueueRequest = (requestFunc, getUrl) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ requestFunc, getUrl, resolve, reject });
    if (!requestInProgress) {
      processQueue();
    }
  });
};

const formatParams = (params) => {
  const formattedParams = {};
  for (const [key, value] of Object.entries(params)) {
    // Check if value is defined and not empty
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        formattedParams[key] = `[${value}]`;
      } else {
        formattedParams[key] = value;
      }
    }
  }
  return formattedParams;
};

export const fetchAll = async (params = {}, endpoint) => {
  const getUrl = formatUrl(`${apiUrl}/${endpoint}`);
  if (!getUrl || getUrl.includes("undefined")) {
    return { error: "URL is undefined" };
  }
  const formattedParams = formatParams(params);

  return enqueueRequest(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.get(getUrl, {
        params: formattedParams,
        headers,
      });

      if (response.status === 200) {
        return {
          success: "Return successfully",
          data: response.data,
        };
      } else if (response.status === 401) {
        handle401Error();
        return { error: "401 error" };
      }

      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handle401Error();
      }
      if (error.response && error.response.status === 403) {
        handle403Error();
      }
      return {
        error: error,
        message: error?.response?.data?.error,
      };
    }
  }, getUrl);
};

export const fetchData = async (params = {}, endpoint) => {
  const token = await getFromDB("authToken");
  const tenant = getTenant();
  const getUrl = formatUrl(`${apiUrl}/${endpoint}`);
  if (!token) {
    return handle401Error();
  }
  if (!getUrl || getUrl.includes("undefined")) {
    return { error: "URL is undefined" };
  }
  const formattedParams = formatParams(params);

  return enqueueRequest(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-Tenant": tenant,
      };

      const response = await axios.get(getUrl, {
        params: formattedParams,
        headers,
      });

      if (response.status === 200) {
        return {
          success: "Return successfully",
          data: response.data,
        };
      } else if (response.status === 401) {
        handle401Error();
        return { error: "401 error" };
      }

      return response;
    } catch (error) {
      console.log("error", error);

      if (error.response && error.response.status === 401) {
        handle401Error();
      }
      if (error.response && error.response.status === 403) {
        handle403Error();
      }
      // ToastTemplates.error(error?.response?.data?.error || error.message);
      return {
        error: error,
        message: error?.response?.data?.error,
      };
    }
  }, getUrl);
};

export const postData = async (formData = {}, endpoint) => {
  const token = await getFromDB("authToken");
  const postUrl = formatUrl(`${apiUrl}/${endpoint}`);
  const tenant = getTenant();

  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Tenant": tenant,
    };

    if (endpoint !== "login") {
      headers.Authorization = `Token ${token}`;
    }

    const response = await axios.post(postUrl, formData, { headers });

    if (response.status === 201) {
      return {
        success: "Added successfully",
        data: response.data,
      };
    } else if (response.status === 401) {
      handle401Error();
      return { error: "401 error" };
    }

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handle401Error();
    }

    ToastTemplates.error(error?.response?.data?.error || error.message);
    return {
      error: error,
      message: error?.response?.data,
    };
  }
};

export const updateData = async (formData = {}, endpoint) => {
  const token = await getFromDB("authToken");
  const postUrl = formatUrl(`${apiUrl}/${endpoint}`);
  const tenant = getTenant();

  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Tenant": tenant,
    };

    if (endpoint !== "login") {
      headers.Authorization = `Token ${token}`;
    }

    const response = await axios.patch(postUrl, formData, { headers });

    if (response.status === 201) {
      return {
        success: "Added successfully",
        data: response.data,
      };
    } else if (response.status === 401) {
      handle401Error();
      return { error: "401 error" };
    }

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handle401Error();
    }

    ToastTemplates.error(error?.response?.data?.error || error.message);
    return {
      error: error,
      message: error?.response?.data,
    };
  }
};

export const updateData1 = async (formData = {}, endpoint) => {
  const token = await getFromDB("authToken");
  const updateUrl = formatUrl(`${apiUrl}/${endpoint}`);
  const tenant = getTenant();

  return enqueueRequest(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-Tenant": tenant,
      };
      const transformFormData = (data) => {
        return Object.fromEntries(
          Object.entries(data).map(([key, value]) => {
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              typeof value[0] === "object"
            ) {
              return [key, value.map((item) => item.id)];
            }
            return [key, value];
          })
        );
      };

      const transformedData = transformFormData(formData);

      const response = await axios.patch(updateUrl, transformedData, {
        headers,
      });

      if (response.status === 200) {
        return {
          success: "Updated successfully",
          data: response.data,
        };
      } else if (response.status === 401) {
        handle401Error();
        return { error: "401 error" };
      }

      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handle401Error();
      }
      if (error.response && error.response.status === 403) {
        handle403Error();
      }
      ToastTemplates.error(error?.response?.data?.error || error.message);
      return {
        error: error,
        message: error?.response?.data?.error,
      };
    }
  });
};

export const deleteData = async (endpoint) => {
  const token = await getFromDB("authToken");
  const deleteUrl = formatUrl(`${apiUrl}/${endpoint}`);
  const tenant = getTenant();

  return enqueueRequest(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-Tenant": tenant,
      };

      const response = await axios.delete(deleteUrl, { headers });

      if (response.status === 204) {
        return {
          success: "Deleted successfully",
        };
      } else if (response.status === 401) {
        handle401Error();
        return { error: "401 error" };
      }

      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handle401Error();
      }
      if (error.response && error.response.status === 403) {
        handle403Error();
      }
      ToastTemplates.error(error?.response?.data?.error || error.message);
      return {
        error: error,
        message: error?.response?.data?.error,
      };
    }
  });
};

const handleApiRequest = async (endpoint, formData = {}, headers = {}) => {
  const postUrl = formatUrl(`${apiUrl}/${endpoint}`);

  return enqueueRequest(async () => {
    try {
      const response = await axios.post(postUrl, formData, { headers });

      if (response.status === 200 || response.status === 201) {
        return {
          success: "Operation successful",
          data: response.data,
        };
      } else {
        return { error: `Unexpected status code: ${response.status}` };
      }
    } catch (error) {
      ToastTemplates.error(error?.response?.data?.error || error.message);
      return {
        error: error,
        message: error?.response?.data?.error || "An error occurred",
      };
    }
  });
};

export const login = async (formData = {}) => {
  const tenant = getTenant();
  return handleApiRequest("login", formData, {
    "Content-Type": "application/json",
    "X-Tenant": tenant,
  });
};

export const validateOtp = async (formData = {}) => {
  const tenant = getTenant();
  return handleApiRequest("otp/activate", formData, {
    "Content-Type": "application/json",
    "X-Tenant": tenant,
  });
};

export const resendOtp = async (formData = {}) => {
  const tenant = getTenant();
  return handleApiRequest("resend-otp", formData, {
    "Content-Type": "application/json",
  });
};

export const logout = async () => {
  const { token } = parseCookies();
  const tenant = getTenant();
  return handleApiRequest(
    "logout",
    {},
    {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      "X-Tenant": tenant,
    }
  );
};
export { apiUrl };

export const fetchJSON = async (filePath) => {
  try {
    const response = await fetch(
      `/api/load-file?filePath=${encodeURIComponent(filePath)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filePath}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const uploadFile = async (file, folder, filename, isPrivate) => {
  const token = await getFromDB("authToken"); // Get auth token
  const uploadUrl = formatUrl(`${apiUrl}/upload-file/`); // API endpoint
  const tenant = getTenant(); // Get tenant information
  const isPrivateFolder = isPrivate ? "private" : "public"; // Check if folder is private

  try {
    const headers = {
      "X-Tenant": tenant,
      Authorization: `Token ${token}`, // Add auth token
    };

    // Create FormData object
    const formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("folder", `${tenant}/${isPrivateFolder}/${folder}`); // Append the folder name
    formData.append("filename", filename); // Append the desired filename

    // Debugging: Log FormData entries
    for (const [key, value] of formData.entries()) {
      console.log(`FormData Key: ${key}, Value:`, value);
    }

    // Send the request
    const response = await axios.post(uploadUrl, formData, { headers });

    if (response.status === 201) {
      return {
        success: "File uploaded successfully",
        url: response.data.url, // Return the file URL
      };
    } else if (response.status === 401) {
      handle401Error(); // Handle 401 error
      return { error: "401 error" };
    }

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handle401Error(); // Handle 401 error
    }

    ToastTemplates.error(error?.response?.data?.error || error.message); // Show error toast
    return {
      error: error,
      message: error?.response?.data,
    };
  }
};
