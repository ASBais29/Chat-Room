const genMes = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
const locatMes = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports={genMes,locatMes}