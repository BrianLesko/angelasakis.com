// MARKDOWN RENDERING
async function initializeMarkdownRenderer(markdownFilePath) {
  try {
    // Set Marked.js options
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true,
      smartypants: true,
      headerIds: true,
    });

    const response = await fetch(markdownFilePath);
    const markdownContent = await response.text();
    const htmlContent = marked.parse(markdownContent);

    // Inject rendered content into the page
    const contentElement = document.getElementById("content");
    if (contentElement) {
      contentElement.innerHTML = htmlContent;
      console.log("Rendered HTML:", htmlContent);

      // Initialize accordion functionality after content is injected
      initializeAccordion();
    } else {
      console.warn("Content element not found in the DOM.");
    }
  } catch (error) {
    console.error("Error loading Markdown file:", error);
  }
}

// ACCORDION FUNCTIONALITY
function initializeAccordion() {
  const accordions = document.querySelectorAll(".accordion");

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      this.classList.toggle("active");

      // Get the icon and toggle its state
      const icon = this.querySelector(".accordion-icon");
      if (icon.classList.contains("plus")) {
        icon.classList.remove("plus");
        icon.classList.add("minus");
      } else {
        icon.classList.remove("minus");
        icon.classList.add("plus");
      }

      // Toggle panel visibility
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null; // Collapse
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px"; // Expand
      }
    });
  });
}

// URL REDIRECT TRACER
async function traceRedirects(initialUrl) {
  // Initialize variables
  let redirectPath = [];
  let currentUrl = initialUrl;
  let redirectCount = 0;
  const maxRedirects = 20;

  // HTML element to display results
  const resultsDiv = document.getElementById("redirect-results");
  if (!resultsDiv) {
    console.error("Results container not found");
    return;
  }

  resultsDiv.innerHTML =
    '<h3 class="text-lg font-bold mb-2">Tracing redirects...</h3>';

  try {
    while (redirectCount < maxRedirects) {
      // Show current URL being checked
      resultsDiv.innerHTML += `<p>Checking: ${currentUrl}</p>`;

      // Make request to current URL
      const response = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        mode: "cors",
      });

      // Record the status code
      const statusCode = response.status;
      let redirectType = null;

      // Add to redirect path
      redirectPath.push({ url: currentUrl, statusCode, redirectType });

      // Check if this is not a redirect
      if (![301, 302, 303, 307, 308].includes(statusCode)) {
        resultsDiv.innerHTML +=
          '<p class="text-green-500">Chain ended with non-redirect status code.</p>';
        break;
      }

      // Get new location
      const location = response.headers.get("Location");
      if (!location) {
        resultsDiv.innerHTML +=
          '<p class="text-red-500">Redirect without Location header!</p>';
        break;
      }

      // Convert relative URL to absolute if needed
      const newUrl = new URL(location, currentUrl).href;

      // Set the redirect type based on status code
      switch (statusCode) {
        case 301:
          redirectType = "permanent";
          break;
        case 302:
        case 303:
          redirectType = "temporary";
          break;
        case 307:
          redirectType = "temporary (same method)";
          break;
        case 308:
          redirectType = "permanent (same method)";
          break;
      }

      // Update the redirectType in the last entry
      redirectPath[redirectPath.length - 1].redirectType = redirectType;

      // Check for loops
      const previousUrls = redirectPath.map((entry) => entry.url);
      if (previousUrls.slice(0, -1).includes(newUrl)) {
        resultsDiv.innerHTML += '<p class="text-red-500">Loop detected!</p>';
        break;
      }

      // Update for next iteration
      currentUrl = newUrl;
      redirectCount++;
    }

    // Check if max redirects reached
    if (redirectCount >= maxRedirects) {
      resultsDiv.innerHTML +=
        '<p class="text-yellow-500">Maximum redirects reached!</p>';
    }

    // Display the redirect path
    resultsDiv.innerHTML +=
      '<h3 class="text-lg font-bold mt-4 mb-2">Redirect Path:</h3>';
    resultsDiv.innerHTML += '<ul class="list-disc pl-6">';
    redirectPath.forEach((entry, index) => {
      resultsDiv.innerHTML += `
        <li class="mb-2">
          <span class="font-semibold">${index + 1}.</span> 
          <a href="${entry.url}" target="_blank" class="text-blue-500 underline">${entry.url}</a>
          <br>
          <span class="ml-6">Status: ${entry.statusCode} ${entry.redirectType ? `(${entry.redirectType})` : ""}</span>
        </li>`;
    });
    resultsDiv.innerHTML += "</ul>";
  } catch (error) {
    resultsDiv.innerHTML += `<p class="text-red-500">Error: ${error.message}</p>`;
    console.error("Redirect tracing error:", error);
  }
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  // Load and render markdown content
  const markdownFilePath = "./home.md"; // Update with your file path
  initializeMarkdownRenderer(markdownFilePath);

  // Initialize redirect tracer
  const traceButton = document.getElementById("trace-redirects");
  if (traceButton) {
    traceButton.addEventListener("click", function () {
      const urlInput = document.getElementById("url-input");
      const url = urlInput ? urlInput.value : "https://angelasakis.com";
      traceRedirects(url || "https://angelasakis.com");
    });
  }
});
