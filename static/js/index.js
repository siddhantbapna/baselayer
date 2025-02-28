function randomNess(l) {
    let scope = 'abcdefghijklmnopqrstuvwxyz'
    return [...Array(l)].map(() => scope[Math.floor(Math.random() * scope.length)]).join('')
}