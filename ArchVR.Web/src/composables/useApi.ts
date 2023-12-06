import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../../ArchVR.Api/src/index";

class TokenRefreshFetch {
  constructor(
    private baseUrl: string,
    private tokenEndpoint: string
  ) {
    console.log(this.baseUrl, this.tokenEndpoint);
  }
  async fetchWithToken(
    url: RequestInfo | URL,
    options: RequestInit
  ): Promise<Response> {
    //get accessToken from local storage
    const accessToken = localStorage.getItem("accessToken");
    let { headers } = options;
    if (accessToken) {
      headers = {
        ...headers,
        Authorization: `bearer ${accessToken}`,
      };
    }

    return fetch(url, { ...options, headers }).then(async (res) => {
      //check for a 401
      if (res.status === 401) {
        const { accessToken, refreshToken } = await fetch(
          `${process.env.BASE_URL}${process.env.REFRESH_ENDPOINT}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken: localStorage.getItem("refreshToken") as string,
            }),
          }
        ).then((res) => {
          //if the refresh was ok, return json which will have new tokens
          if (res.ok) {
            return res.json();
          }
          // reject everything time to throw errors
          return Promise.reject(res);
        });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        // attempt to run the original fetch again now we have new tokens
        return this.fetchWithToken(url, options);
      }
      return res;
    });
  }
}

// class TokenRefreshFetchWrapper {
//   private baseUrl: string;
//   private tokenEndpoint: string;
//   private token: string;

//   constructor(baseUrl: string, tokenEndpoint: string, initialToken: string) {
//     this.baseUrl = baseUrl;
//     this.tokenEndpoint = tokenEndpoint;
//     this.token = initialToken;
//   }

//   async fetchWithToken(
//     url: RequestInfo | URL,
//     options: RequestInit = {}
//   ): Promise<Response> {
//     if (!this.token) {
//       throw new Error("No token available for the request.");
//     }

//     const headers: HeadersInit = {
//       ...options.headers,
//       Authorization: `Bearer ${this.token}`,
//     };

//     const response = await fetch(`${this.baseUrl}${url}`, {
//       ...options,
//       headers,
//     });

//     if (response.status === 401) {
//       // If the response status is 401, try to refresh the token.
//       const newToken = await this.refreshToken();
//       if (newToken) {
//         // If a new token is obtained, update it and retry the original request.
//         this.token = newToken;
//         return this.fetchWithToken(url, options);
//       }
//     }

//     return response;
//   }

//   async refreshToken(): Promise<string | null> {
//     try {
//       const tokenResponse = await fetch(this.tokenEndpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${this.token}`,
//         },
//         // Add any additional data required to refresh the token, e.g., refresh token.
//         body: JSON.stringify({ refresh_token: this.refreshToken }),
//       });

//       if (tokenResponse.ok) {
//         const { access_token } = await tokenResponse.json();
//         return access_token;
//       }
//     } catch (error) {
//       console.error("Failed to refresh the token:", error);
//     }

//     // If token refresh fails or any other error occurs, return null.
//     return null;
//   }
// }
// const accessToken = localStorage.getItem("accessToken");
// const refreshFetchWrapper = new TokenRefreshFetchWrapper(
//   process.env.BASE_URL as string,
//   "/auth/refresh-token",
//   accessToken as string
// );

const tokenRefreshFetch = new TokenRefreshFetch(
  process.env.BASE_URL as string,
  "/auth/refresh-token"
);

//@ts-ignore
const useApi = (baseUrl: string) =>
  edenTreaty<App>(baseUrl, {
    //@ts-ignore
    fetcher: tokenRefreshFetch.fetchWithToken,
  });

export default useApi;
