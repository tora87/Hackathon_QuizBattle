
  const user = {
   user:"admin",
   pwd:"password",
    roles:[
   {
    role:"userAdminAnyDatabase",
   db:"session"
    }
   ]
   }

   db.createUser(user)
   