import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly heroServices : UserService){}
    @Get('')
    getUsers(){
         return this.heroServices.getUsers();
    }

    @Get(':id')
    getUser(@Param('id') id){
     return this.heroServices.getUser(id);
    }

    @Post('')
    createUser(@Body() userData){
     return this.heroServices.createUser(userData);
    }

    @Put(':id')
    updateUser(@Param('id') id, @Body() userData){
     return this.heroServices.updateUser(id, userData);
    }

    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe) id){
     return this.heroServices.deleteUser(id);
    }
}
