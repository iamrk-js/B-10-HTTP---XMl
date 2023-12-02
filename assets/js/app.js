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


const onEdit = (ele) => {
    // cl(ele.closest(".card").id)
    let getEditId = ele.closest(".card").id;
    cl(getEditId)
    localStorage.setItem("getEditId", getEditId);
    let editUrl = `${baseUrl}/posts/${getEditId}`;

    makeApiCall("GET", editUrl);
}


const onDelete = (ele) => {
    cl(ele)
    let deleteId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}`;

    makeApiCall("DELETE", deleteUrl)
}

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

const makeApiCall = (methodName, apiUrl, bodyMsg = null) => {
    let xhr = new XMLHttpRequest();
    // xhr.open("GET", postsUrl);
    xhr.open(methodName, apiUrl);
    xhr.send(JSON.stringify(bodyMsg)); //  we send data to DB
    xhr.onload = function () {
        if (xhr.status >= 200 || xhr.status <= 299 && xhr.readyState === 4) { // 2xx
            cl(xhr.response)
            // templating
            if (methodName === "GET") {
                // here data may be Array or it may be Object
                let data = JSON.parse(xhr.response);
                if (Array.isArray(data)) {
                    templatingOfPosts(data);
                } else {
                    // we will patch data in form
                    // cl(data)
                    updateBtn.classList.remove('d-none');
                    submitBtn.classList.add('d-none');
                    titleControl.value = data.title;
                    bodyControl.value = data.body;
                    userIdControl.value = data.userId;
                }
            }else if(methodName === "PUT"){
                cl(xhr.response)
                let id = JSON.parse(xhr.response).id;
                let card = document.getElementById(id);
                cl(card)
                let cardChild = [...card.children]
                cardChild[0].innerHTML = `<h2>${bodyMsg.title}</h2>`
                cardChild[1].innerHTML = `<p>${bodyMsg.body}</p>`
                // cl(cardChild[0])
                // cl(cardChild[1])
                postForm.reset();
                updateBtn.classList.add('d-none');
                submitBtn.classList.remove('d-none');
            }else if(methodName === "DELETE"){
                let getIndex = apiUrl.indexOf('posts/')
                let id = apiUrl.slice(getIndex + 6);
                cl(id)
                document.getElementById(id).remove()
            }
        }
    }
}

makeApiCall("GET", postsUrl);

const onPostUpdate = () => {
    let updatedPostObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(updatedPostObj)
    let updateId = localStorage.getItem("getEditId");
    let updateUrl = `${baseUrl}/posts/${updateId}`;
    makeApiCall("PUT", updateUrl, updatedPostObj);
}

updateBtn.addEventListener("click", onPostUpdate)



// makeApiCall("GET", `https://jsonplaceholder.typicode.com/todos`);

// xhr.readyState  0 to 4

// 0 >> XHR Object is created but open method is not called yet
// 1 >> Open method is called
// 2 >> send method is called
// 3 >> server is working on your request
// 4 >> the API call is completed (It may be success(data) or it may be fail(error))
