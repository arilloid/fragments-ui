// src/app.js

import { Auth, getUser } from "./auth";
import {
  getUserFragments,
  postUserFragment,
  getUserFragmentsMetadata,
  getFragmentDataByID,
  getFragmentInfoByID,
  deleteFragmentDataByID,
  updateFragmentByID,
} from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const postButton = document.querySelector("#postButton");
  const updateButton = document.querySelector("#updateButton");
  const uploadFileButton = document.querySelector("#uploadImageButton");
  const updateFileButton = document.querySelector("#updateImageButton");
  const getMetadataButton = document.querySelector("#getMetadataButton");
  const getByIdButton = document.querySelector("#getByIdButton");
  const getInfoByIdButton = document.querySelector("#getInfoByIdButton");
  const deleteButton = document.querySelector("#deleteButton");

  /**
   * Login functionality
   */

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Do an authenticated request to the fragments API server and log the result
  const userFragments = await getUserFragments(user);
  console.log(userFragments);

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Log the user info for debugging purposes
  console.log({ user });

  /**
   * POST, PUT, GET, DELETE
   */

  // Post the fragment
  postButton.onclick = () => {
    let data = document.querySelector("#data").value;
    let type = document.querySelector("#fragmentType").value;
    postUserFragment(user, data, type);
  };

  // Update the fragment by id
  updateButton.onclick = () => {
    let data = document.querySelector("#data").value;
    let type = document.querySelector("#types").value;
    let id = document.querySelector("#id").value;
    updateFragmentByID(user, data, type, id);
  };

  // Post the image fragment
  uploadFileButton.onclick = () => {
    // Get the first file from the file input element
    let data = document.getElementById("file").files[0];

    if (data != null) {
      alert("Image fragment successfully saved!");
    } else {
      alert("Please upload an image");
    }
    postUserFragment(user, data, data.type);
  };

  // Update the fragment by id
  updateButton.onclick = () => {
    let data = document.querySelector("#data").value;
    let type = document.querySelector("#types").value;
    let id = document.querySelector("#id").value;
    if (id) {
      updateFragmentByID(user, data, type, id);
    } else {
      alert("Error: ID required");
    }
  };

  // Delete the fragment by id
  deleteButton.onclick = () => {
    let id = document.querySelector("#id").value;
    if (id) {
      deleteFragmentDataByID(user, id);
    } else {
      alert("Error: ID required");
    }
  };

  // Get the list of all user's fragments' metadata
  getMetadataButton.onclick = () => {
    getUserFragmentsMetadata(user);
  };

  // Get fragment by id
  getByIdButton.onclick = () => {
    let id = document.querySelector("#id").value;
    if (id) {
      document.getElementById("returnedData").innerHTML = "";
      document.getElementById("image").src = "";
      getFragmentDataByID(user, id);
    } else {
      alert("Error: ID required");
    }
  };

  // Get fragment metadata by id
  getInfoByIdButton.onclick = () => {
    let id = document.querySelector("#id").value;
    if (id) {
      getFragmentInfoByID(user, id);
    } else {
      alert("Error: ID required");
    }
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
