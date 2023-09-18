//  currentUser

const currentUser = fetch('/user/currentUser').then(response => response.json());

//метод. заполнение данных currentUser в шапке
function getEmailAndRoles(data){
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
    .catch(error => console.log(error));

//метод. заполнение таблицы
const getUserTable = (data) => {
    let userTable = `<tr>
    <td>${data.id}</td>
    <td>${data.name}</td>
    <td>${data.lastName}</td>
    <td>${data.age}</td>
    <td>${data.email}</td>
    <td>
    <span>`;
    data.roles.forEach(e => {
        let roleName = `${e.name}`;
        let roleNewName = roleName.replace('ROLE_', ' ');
        userTable += `${roleNewName}`;
    });
    userTable += `</span>
    </td>
    </tr>`;
    document.getElementById('userTable').innerHTML = userTable;
};

//заполнение таблицы
currentUser.then(data => getUserTable(data))




