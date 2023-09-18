//  currentUser
const currentUser = fetch('/admin/currentUser').then(response => response.json());

//метод. заполнение данных currentUser в шапке

function getEmailAndRoles(data) {
    let currentUserEmail = `${data.email}`;
    let currentUserRoles = ``;
    data.roles.forEach(e => {
        let roleName = `${e.name}`;
        let roleNewName = roleName.replace('ROLE_', ' ');
        currentUserRoles += `${roleNewName}`;
    });
    document.getElementById('UserEmail').innerHTML = currentUserEmail;
    document.getElementById('UserRoles').innerHTML = currentUserRoles;
};

//заполнение данных currentUser в шапке
currentUser.then(data => getEmailAndRoles(data))

//AllUsers
const users = fetch('/admin/users').then(response => response.json())

//реализация заполнения таблицы юзеров
function getUserTable(data) {
    let temp = '';
    data.forEach(user => {
        temp += `<tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.lastName}</td>
        <td>${user.age} </td>
        <td>${user.email}</td>
        <td>${user.roles.map(role => role.name.substring(5))}</td>
        <td>
        <button class="btn btn-primary" id="editUserButton" data-bs-toggle="modal"
        data-bs-target="#editModal">Edit</button>
        </td>
        <td><button class="btn btn-danger"  id="deleteUserButton" data-bs-toggle="modal"
         data-bs-target="#DELETE">Delete</button>
         </td>                           
        </tr>`
        document.getElementById("users").innerHTML = temp;
    })
}

//заполнение таблицы
users.then(data => getUserTable(data))

//добавление нового юзера
const newUser = document.getElementById('newUserForm')
newUser.addEventListener('submit', createNewUser)

// получение ролей
const allRoles = fetch('/admin/roles').then(response => response.json())

//заполнение выбора роли
allRoles.then(e => {
    let temp = ``
    for (const i in e) {
        temp += `<option value = ${e[i].id}>${e[i].name.replace("ROLE_", "")}</option>`
    }
    document.getElementById('rolesUserAdd').innerHTML = temp;
})



async function createNewUser(event) {
    event.preventDefault()
    let rolesForm = document.getElementById('rolesUserAdd')
    let rolesSelected = []
    for (let i = 0; i < rolesForm.options.length; i++) {
        if (rolesForm.options[i].selected) {
            rolesSelected.push({id: rolesForm.options[i].value, name: 'ROLE_' + rolesForm.options[i].innerHTML})
        }
    }
    await fetch('/admin/new', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({
            name: newUser.name.value,
            lastName: newUser.lastName.value,
            age: newUser.age.value,
            email: newUser.email.value,
            password: newUser.password.value,
            roles: rolesSelected
        })

    })
        .then(response => response.json())
    document.getElementById('nav-home-tab').click()
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e.target)
        }
    })
}

//изменение юзера
const idEdit = document.getElementById('idUserEdit')
const firstNameEdit = document.getElementById('nameUserEdit')
const lastNameEdit = document.getElementById('lastNameUserEdit')
const ageEdit = document.getElementById('ageUserEdit')
const emailEdit = document.getElementById('emailUserEdit')
const passwordEdit = document.getElementById('passwordUserEdit')
const rolesEdit = document.getElementById('rolesUserEdit')

let rowEdit = null

on(document, 'click', '#editUserButton', e => {
    rowEdit = e.parentNode.parentNode
    idEdit.value = rowEdit.children[0].innerHTML
    firstNameEdit.value = rowEdit.children[1].innerHTML
    lastNameEdit.value = rowEdit.children[2].innerHTML
    ageEdit.value = Number(rowEdit.children[3].innerHTML)
    emailEdit.value = rowEdit.children[4].innerHTML
    passwordEdit.value = rowEdit.children[5].innerHTML
    let options = ''
    allRoles.then(e => {
        e.forEach(role => {
            let selected = rowEdit.children[5].innerHTML.includes(role.name.replace('ROLE_', '')) ? 'selected' : ''
            options += `<option value="${role.id}" ${selected}>${role.name.replace('ROLE_', '')}</option>`
        })
        rolesEdit.innerHTML = options;
    })
    $('#editModal').modal('show');
})

document.getElementById('editForm').addEventListener('submit', e => {
    e.preventDefault()
    let rolesEd = rolesEdit
    let rolesEditSelected = []
    let rolesEditCell = ''
    for (let i = 0; i < rolesEd.options.length; i++) {
        if (rolesEd.options[i].selected) {
            rolesEditSelected.push({id: rolesEd.options[i].value, name: 'ROLE_' + rolesEd.options[i].innerHTML})
            rolesEditCell += rolesEd.options[i].innerHTML + ' '
        }
    }
    fetch('/admin/edit', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({
            id: idEdit.value,
            name: firstNameEdit.value,
            lastName: lastNameEdit.value,
            age: ageEdit.value,
            email: emailEdit.value,
            password: passwordEdit.value,
            roles: rolesEditSelected
        })
    })
        .then(response => response.json())
    rowEdit.children[1].innerHTML = firstNameEdit.value
    rowEdit.children[2].innerHTML = lastNameEdit.value
    rowEdit.children[3].innerHTML = ageEdit.value
    rowEdit.children[4].innerHTML = emailEdit.value
    rowEdit.children[5].innerHTML = rolesEditCell
    document.getElementById('closeEdit').click()
})

//удаление юзера
const idDelete = document.getElementById('idUserDelete')
const firstNameDelete = document.getElementById('nameUserDelete')
const lastNameDelete = document.getElementById('lastNameUserDelete')
const ageDelete = document.getElementById('ageUserDelete')
const emailDelete = document.getElementById('emailUserDelete')
const rolesDelete = document.getElementById('rolesUserDelete')

let rowDelete = null

on(document, 'click', '#deleteUserButton', e => {
    rowDelete = e.parentNode.parentNode
    idDelete.value = rowDelete.children[0].innerHTML
    firstNameDelete.value = rowDelete.children[1].innerHTML
    lastNameDelete.value = rowDelete.children[2].innerHTML
    ageDelete.value = rowDelete.children[3].innerHTML
    emailDelete.value = rowDelete.children[4].innerHTML
    let options = ''
    allRoles.then(e => {
        e.forEach(role => {
            if (rowDelete.children[5].innerHTML.includes(role.name.replace('ROLE_', ''))) {
                options += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`
            }
        })
        rolesDelete.innerHTML = options;
    })
    $('#deleteModal').modal('show');
})

document.getElementById('deleteForm').addEventListener('submit', e => {
    e.preventDefault()
    fetch('/admin/delete/' + rowDelete.children[0].innerHTML, {
        method: 'DELETE'
    }).then(() => {
        document.getElementById('closeDelete').click();
        rowDelete.parentNode.removeChild(rowDelete)
    })
})


