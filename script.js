 
function fetchPosts() {
    const subreddit = document.getElementById('subredditInput').value;
    fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(response => response.json())
        .then(data => {
            const posts = data.data.children;
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.innerHTML = ''; // Clear previous posts
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3><a href="https://www.reddit.com${post.data.permalink}" target="_blank">${post.data.title}</a></h3>
                    <p>Author: ${post.data.author}</p>
                    <p>Score: ${post.data.score}</p>
                    ${getMediaHtml(post.data)} <!-- Display media -->
                    <p>Description: ${post.data.selftext}</p>
                    <hr>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            alert('Error fetching posts. Please try again later.');
        });
}



function getMediaHtml(postData) {
    let mediaHtml = '';
    if (postData.preview && postData.preview.images.length > 0) {
        const previewImage = postData.preview.images[0].source.url;
        mediaHtml += `<a href="${postData.url}" target="_blank"><img src="${previewImage}" alt="Image"></a>`;
    } else if (postData.media && postData.media.type === 'image') {
        const imageUrl = postData.media.content;
        mediaHtml += `<a href="${postData.url}" target="_blank"><img src="${imageUrl}" alt="Image"></a>`;
    } else if (postData.media && postData.media.type === 'video') {
        const videoUrl = postData.media.reddit_video.fallback_url;
        mediaHtml += `
            <a href="${postData.url}" target="_blank">
                <video controls autoplay>
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </a>
        `;
    } else if (postData.is_video) {
        // If it's a video post but not covered by the above cases
        const videoUrl = postData.url_overridden_by_dest;
        mediaHtml += `
            <a href="${postData.url}" target="_blank">
                <video controls autoplay>
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </a>
        `;
    } else if (postData.url_overridden_by_dest) {
        const url = postData.url_overridden_by_dest;
        if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif')) {
            mediaHtml += `<a href="${postData.url}" target="_blank"><img src="${url}" alt="Image"></a>`;
        }
    }
    return mediaHtml;
}