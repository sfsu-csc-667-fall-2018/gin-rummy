module.exports = (con, username, password) => {
       
        con.any(`INSERT INTO players ("points", "username", "password", "wins") VALUES ('${0}', '${username}', '${password}', '${0}')`)
       .then(results=> {
              console.log(results)
           })
       .catch (error => {    
             console.log(error)
           })
}