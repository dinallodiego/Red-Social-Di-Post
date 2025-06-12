import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AccesoService {
    constructor(private userService: UsuariosService){
        
    }

    registrarse(){
        
    }

    login(){
        
    }
}
