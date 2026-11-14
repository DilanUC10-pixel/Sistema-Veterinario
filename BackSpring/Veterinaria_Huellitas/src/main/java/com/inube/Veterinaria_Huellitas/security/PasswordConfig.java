package com.inube.Veterinaria_Huellitas.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//herrmienta de spring security para encriptar contraseñas
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    //bean nos permite declarar quelo que debuelva este metodo va a ser un objeto
    // que se va a poder inyectar en cualquier parte de la aplicacion
    @Bean
    //metodo que devuelve un objeto de tipo PasswordEncoder
    public PasswordEncoder passwordEncoder() {
        //llamada al constructor de la clase BCryptPasswordEncoder
        // para crear un objeto de tipo PasswordEncoder
        return new BCryptPasswordEncoder();
    }
}