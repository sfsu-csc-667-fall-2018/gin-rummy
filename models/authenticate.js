module.exports = (con, username) => {     
   return con.any(`SELECT * from players where username =$1`,[username])
    .then ( (results)=> {  

            if (results.length >= 1 ) {
                return({status: 'failure'})
             }
             else {                      
                return ({status: 'success'})
            }
         })       
 .catch(error=> {
  console.log(error)
   })
}