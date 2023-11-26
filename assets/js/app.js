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
    cl(ele)
    let getId = ele.closest(".card").id;
    cl(getId);
    localStorage.setItem("editId", getId);
    // `${baseUrl}/posts/:id`
    let getObjUrl = `${baseUrl}/posts/${getId}`;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", getObjUrl, true);

    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            cl(xhr.response);
            let getObj = JSON.parse(xhr.response);
            titleControl.value = getObj.title;
            bodyControl.value = getObj.body;
            userIdControl.value = getObj.userId;
            updateBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none');
        }
    }

}

const onDelete = (ele) => {
    cl(ele)
    let getDeleteId = ele.closest('.card').id;
    cl(getDeleteId);

    let deleteUrl = `${baseUrl}/posts/${getDeleteId}`;

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", deleteUrl);

    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            cl(xhr.response)

            let card = document.getElementById(getDeleteId);
            cl(card);
            card.remove()
        }
    }
}

const templating = (arr) => {
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

const createPost = (postObj) => {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", postsUrl, true);

    xhr.send(JSON.stringify(postObj));

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) { // 2xx
            cl(xhr.response) // "{"id" : 101}" 
            postObj.id = JSON.parse(xhr.response).id;
            postsArray.push(postObj);
           // templating(postsArray); // 100 obj + 1 obj
           createCards(postObj)
        }
    }
}

const onSubmitPost = (eve) => {
    eve.preventDefault();
    let newPost = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(newPost);
    postForm.reset();
    createPost(newPost) // API call to create a new PostObj

}

const getAllPosts = () => {
    // 1 create a instance/object XMLHttpRequest
    let xhr = new XMLHttpRequest();
    // 2 Configration
    xhr.open("GET", postsUrl, true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status === 200) {
            // cl(xhr.response)
            postsArray = JSON.parse(xhr.response);
            // cl(data)
            templating(postsArray);
        } else {
            alert(`Something went wrong !!!`)
        }
        // teamplating 
        //cl(xhr.status) // 200
        //cl(xhr.statusText) // 200
    }
}
getAllPosts();

const onPostUpdate = () => {
    let updatedObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(updatedObj)
    let getEditId = localStorage.getItem("editId");
    cl(getEditId)
    let updateUrl = `${baseUrl}/posts/${getEditId}` // for updating obj in DB
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", updateUrl, true);

    xhr.send(JSON.stringify(updatedObj));

    xhr.onload = function () {
        if (xhr.status === 200) {
            cl(xhr.response)
            let getIndexOfObj = postsArray.findIndex(post => {
                return post.id == getEditId
            })

            cl(getIndexOfObj);

            postsArray[getIndexOfObj].title = updatedObj.title;
            postsArray[getIndexOfObj].body = updatedObj.body;
            postsArray[getIndexOfObj].userId = updatedObj.userId;

            templating(postsArray);
        }

        postForm.reset()
    }
}


postForm.addEventListener("submit", onSubmitPost);
updateBtn.addEventListener("click", onPostUpdate)

