let cl = console.log;
const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");


let baseUrl = `https://batch-10-js-crud-posts-default-rtdb.asia-southeast1.firebasedatabase.app`;

let postUrl = `${baseUrl}/posts.json`

// baseUrl/posts/:id.json

const objToArr = (obj) => {
    let arr = [];
    for (const key in obj) {
        let newObj = obj[key];
        newObj.id = key;
        arr.push(newObj)
    }
    return arr;
}

const onEdit = (ele) => {
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId);
    let editUrl = `${baseUrl}/posts/${editId}.json`;

    makeApiCall("GET", editUrl)
        .then(res => {
            cl(res)
            // callback funct....
            let post = JSON.parse(res);
            updateBtn.classList.remove("d-none");
            submitBtn.classList.add("d-none");
            titleControl.value = post.title;
            bodyControl.value = post.body;
            userIdControl.value = post.userId;
        })
        .catch(err => {
            cl(err)
        })
}

const onDelete = (ele) => {
    cl(ele)
    let deleteId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}.json`;

    let getConfirm = confirm(`Are You sure you want to delete this Post?`)

    if (getConfirm) {
        makeApiCall("DELETE", deleteUrl)
            .then(res => {
                cl(res);
                let deleteCard = document.getElementById(deleteId);
                deleteCard.remove();
            })
            .catch(cl)
    }

}

const createCard = (postObj) => {
    let card = document.createElement("div");
    card.className = "card mb-4";
    card.id = postObj.id;
    card.innerHTML = `
                <div class="card-header">
                    <h2 class="m-0">
                        ${postObj.title}
                    </h2>
                </div>
                <div class="card-body">
                    <p class="m-0">
                    ${postObj.body}
                    </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" type="button" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-danger" type="button" onclick="onDelete(this)">Delete</button>
                </div>
                `

    postsContainer.append(card)
}

const templatingOfPosts = (posts) => {
    // postsContainer.innerHTML = '';
    posts.forEach(post => {
        createCard(post)
    });
}

const makeApiCall = (methodName, apiUrl, body = null) => {
    return new Promise((resolve, reject) => {
        loader.classList.remove('d-none');
        let xhr = new XMLHttpRequest();
        xhr.open(methodName, apiUrl, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
                loader.classList.add('d-none');
            } else {
                reject(xhr.statusText);
                loader.classList.add('d-none');
            }

        }
        xhr.send(body);
    })
}

//SOLID 
makeApiCall("GET", postUrl)
    .then(res => {
        let data = JSON.parse(res);
        // cl(data)
        let postArr = objToArr(data);
        cl(postArr);
        templatingOfPosts(postArr);
    })
    .catch(err => {
        cl(err)
    })

const onPostUpdate = () => {
    let updateId = localStorage.getItem("editId")
    let updateUrl = `${baseUrl}/posts/${updateId}.json`;
    let updatedObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    makeApiCall("PUT", updateUrl, JSON.stringify(updatedObj))
        .then(res => {
            cl(res);
            let data = JSON.parse(res);
            let getCard = document.getElementById(updateId);
            cl(getCard)
            let cardChild = [...getCard.children];
            cl(cardChild)
            cardChild[0].innerHTML = `<h2 class="m-0">${data.title}</h2>`;
            cardChild[1].innerHTML = `<p class="m-0">${data.body}</p>`;
        })
        .catch(cl)
        .finally(() => {
            postForm.reset();
            updateBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');
        })
}

const onPostSubmit = (eve) => {
    eve.preventDefault();
    let newPost = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(newPost);

    makeApiCall("POST", postUrl, JSON.stringify(newPost))
        .then(res => {
            cl(res)
            let post = newPost;
            post.id = JSON.parse(res).name
            createCard(post)
        })
        .catch(cl)
        .finally(() => {
            // 
            eve.target.reset()
        })
}

updateBtn.addEventListener("click", onPostUpdate);
postForm.addEventListener("submit", onPostSubmit)