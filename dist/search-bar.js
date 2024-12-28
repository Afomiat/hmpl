// JavaScript to handle the search functionality
function searchPosts() {
    const query = document.getElementById("searchInput").value.toLowerCase(); // Get the search input
    const posts = document.querySelectorAll(".post-item"); // Get all post items
    
    posts.forEach(post => {
      const title = post.querySelector("h3").innerText.toLowerCase(); // Get the post title
      const excerpt = post.querySelector(".post-meta").innerText.toLowerCase(); // Get the post excerpt
  
      // If the title or excerpt contains the search query, display the post, otherwise hide it
      if (title.includes(query) || excerpt.includes(query)) {
        post.style.display = "block";
      } else {
        post.style.display = "none";
      }
    });
  }
  