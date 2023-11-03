const welcome = document.getElementById('welcome');
const img = document.getElementsByTagName('img')[0];
function readTokenFromCookie() {
    const cookie = document.cookie;
    const tokenName = 'token=';
    const tokenStartIndex = cookie.indexOf(tokenName);
    if (tokenStartIndex === -1) {
        return null;
    }
    const tokenEndIndex = cookie.indexOf(';', tokenStartIndex + tokenName.length);
    const tokenValue = decodeURIComponent(
        cookie.substring(tokenStartIndex + tokenName.length, tokenEndIndex === -1 ? cookie.length : tokenEndIndex),
    );
    return tokenValue;
}
const token = readTokenFromCookie();

fetch('http://localhost:4000/api/user/profile/me', {
    headers: new Headers({
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
    }),
})
    .then((response) => response.json())
    .then((response) => {
        console.log(response.user.inforUser);
        img.src = response.user.inforUser.avatar;
        welcome.innerText = `welcome ${response.user.inforUser.firstname} ${response.user.inforUser.lastname}`;
    });
const socket = io('http://localhost:4000');

socket.on('connect_error', (error) => console.log('error connect'));
socket.on('connect', () => console.log('user connect'));
