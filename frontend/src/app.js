import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
            ]
        }
    });

    const newPostBtn = document.getElementById('newPostBtn');
    const postForm = document.getElementById('postForm');
    const blogForm = document.getElementById('blogForm');
    const postsSection = document.getElementById('posts');

    newPostBtn.addEventListener('click', () => {
        postForm.classList.toggle('hidden');
        if (!postForm.classList.contains('hidden')) {
            postForm.style.opacity = '0';
            setTimeout(() => {
                postForm.style.opacity = '1';
            }, 50);
        }
    });

    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const body = quill.root.innerHTML;

        try {
            await backend.addPost(title, body, author);
            blogForm.reset();
            quill.setContents([]);
            postForm.classList.add('hidden');
            await displayPosts();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    });

    async function displayPosts() {
        try {
            const posts = await backend.getPosts();
            postsSection.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <div class="post-meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</div>
                    <div class="post-body">${post.body}</div>
                `;
                postsSection.appendChild(postElement);
                setTimeout(() => {
                    postElement.style.opacity = '1';
                    postElement.style.transform = 'translateY(0)';
                }, 50);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    await displayPosts();
});