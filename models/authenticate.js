module.exports = (con, username) => {     
   return con.any(`SELECT * from players where username =$1`,[username])
    .then ( (results)=> {  
        return new Promise( (resolve, reject)=> {
            if (results.length >= 1 ) {
                reject({status: 'failure'})
             }
             else {                      
             resolve ({status: 'success'})
            }
         })       
    })
 .catch(error=> {
  console.log(error)
   })
}