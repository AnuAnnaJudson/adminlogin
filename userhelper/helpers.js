var db=require('../routes/connection')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
const { ObjectId } = require('bson')
const { response } = require('express')

module.exports={
    addUsers:(userData)=>{
        // console.log(user);
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)

            db.get().collection('user').insertOne(userData).then((data)=>{
                resolve(data)
        })
    })    
        
    },
    getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let people=await db.get().collection('user').find().toArray()
            resolve(people)
        })
    },
    doLogin:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            let loginStatus='false'
            let response={}
            let u= await db.get().collection('user').findOne({email:userData.email})
            if(u){
                bcrypt.compare(userData.password,u.password).then((status)=>{
                    if(status){
                        console.log("Login Success!!")
                        response.user=u;
                        response.status=true
                        resolve(response)
                    }
                    else{
                        console.log("Unsuccessful login!!!")
                     
                        resolve({status:false})
                    }
                })
           
                
            }else{
                console.log("Unsuccessful login!!!")
                resolve({status:false})
            }    
            
        })
    },
    checkUser:(email)=>{
        // console.log(email)
        return new Promise(async(resolve,reject)=>{
            await db.get().collection('user').findOne({email:email}).then((response)=>{ 
                console.log(response)
                if (response===null){
                    response=0
                    resolve(response)
                }else{
                resolve(response)

                }
                

            })
        })
    },
    deleteUser:(uid)=>{
       return new Promise((resolve,reject)=>{
        db.get().collection('user').deleteOne({_id:objectId(uid)}).then((response)=>{
            resolve(response)
        })
       })
    },
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('user').findOne({_id:objectId(userId)}).then((details)=>{
                resolve(details)
            })
        })
    },
    updateUsers:(userId,userData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('user').updateOne({_id:objectId(userId)},
            {$set:{
                name:userData.name,
                email:userData.email,
                phone:userData.phone
            }}).then((response)=>{
                resolve(response)
            })
        })
    }
}