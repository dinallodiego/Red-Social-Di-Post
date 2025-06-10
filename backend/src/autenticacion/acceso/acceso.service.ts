import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios/usuarios.service';

@Injectable()
export class AccesoService {
    constructor(private userService: UsuariosService){
        
    }

    registrarse(){
        return this.userService.create({});
    }
}
