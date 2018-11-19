module.exports = (con, username, password)=> {
       
      return con.any(`select from players where username='${username}' and password='${password}'`)
      .then(results=> {
             
            if(results.length >=1) {
                 
                return {status: 'success'}
            }
            else {
                 
                return {status: 'failure'}
            }
      })
      .catch(error=> {
            
        console.log(error)
      })
}