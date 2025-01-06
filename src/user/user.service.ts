import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/model/user.schema';
import {Model} from 'mongoose'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getUsers(){
        const findUser = await this.userModel.find()
        return { message : 'All Users', data : findUser}
    }
    
    async getUser(id){
        const oneUser = await this.userModel.findById(id)
        return { message : 'Single Users', data : oneUser}
    }

    async createUser(userDetails):Promise<User>{
        console.log(userDetails)
        const createData = await  this.userModel.create(userDetails)
        return createData.save()
    }

    async updateUser(id,user){
        const editUser = await this.userModel.findByIdAndUpdate(id, user,{
            new : true
        })
        return { message : 'update User', data : editUser}
    }

    async deleteUser(id){
        const deleteUser = await this.userModel.findByIdAndDelete(id)
        return {message : 'Delete User', data : deleteUser}
    }

}
