let cl = console.log;
const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
let baseUrl = `https://jsonplaceholder.typicode.com`;

let postsUrl = `${baseUrl}/posts`

let postsArray = [];

// XMLHttpRequest >> Constructor function
// POST  >> CREATE
// GET  >> READ
// PUT/PATCH >> UPDATE
// DELETE  >> DELETE
const templatingOfPosts = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `
        <div class="card mb-4" id="${post.id}">
            <div class="card-header">
                <h2>${post.title}</h2>
            </div>
            <div class="card-body">
                <p>
                    ${post.body} 
                </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-outline-primary" onclick="onEdit(this)">
                    Edit
                </button>
                <button class="btn btn-outline-danger"
                onclick="onDelete(this)"
                >
                    Delete
                </button>
            </div>
        </div>
           `
    });
    postsContainer.innerHTML = result;
}

const createCards = (postObj) => {
    let card = document.createElement('div');
    card.className = "card mb-4";
    card.id = postObj.id;
    card.innerHTML = `
                    <div class="card-header">
                        <h2>${postObj.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>
                            ${postObj.body} 
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary" onclick="onEdit(this)">
                            Edit
                        </button>
                        <button class="btn btn-outline-danger"
                        onclick="onDelete(this)"
                        >
                            Delete
                        </button>
                    </div>
                    `;
    postsContainer.append(card);
    cl(card)
}

const makeApiCall = (methodName, apiUrl) => {
    let xhr = new XMLHttpRequest();
    // xhr.open("GET", postsUrl);
    xhr.open(methodName, apiUrl);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status >= 200 || xhr.status <= 299 && xhr.readyState === 4) { // 2xx
            cl(xhr.response)
            // templating
            if(methodName === "GET"){
                let data = JSON.parse(xhr.response);
                templatingOfPosts(data);
            }
        }
    }
}

makeApiCall("GET", postsUrl);

// makeApiCall("GET", `https://jsonplaceholder.typicode.com/todos`);

// xhr.readyState  0 to 4

// 0 >> XHR Object is created but open method is not called yet
// 1 >> Open method is called
// 2 >> send method is called
// 3 >> server is working on your request
// 4 >> the API call is completed (It may be success(data) or it may be fail(error))
