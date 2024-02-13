// src/api.js

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Successfully got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function postUserFragments(user, data, type) {
  console.log("Saving the fragment from request...");
  try {
    if (type == "application/json") {
      data = JSON.parse(JSON.stringify(data));
    }

    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-type": type,
      },
      body: data,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    console.log("Posted user fragments data: ", data);
    console.log(res);
  } catch (err) {
    console.error("Unable to call POST /v1/fragments", { err });
  }
}
