package com.inube.Veterinaria_Huellitas.service;

import com.inube.Veterinaria_Huellitas.model.AdoptanteModel;
import com.inube.Veterinaria_Huellitas.dto.LoginRequest;
import com.inube.Veterinaria_Huellitas.dto.LoginResponse;
import com.inube.Veterinaria_Huellitas.repository.AdoptanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import static com.inube.Veterinaria_Huellitas.util.UtilConstants.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdoptanteService {
    private final AdoptanteRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdoptanteModel guardar(AdoptanteModel adoptante) {
        if (adoptante.getEstado() == null) {
            adoptante.setEstado(CODENEG);
        }
        adoptante.setContrasena(passwordEncoder.encode(adoptante.getContrasena()));
        return repository.save(adoptante);
    }

    public LoginResponse iniciarSesion(LoginRequest request) {
        AdoptanteModel adoptante = repository.findByCorreoAndEstado(request.getCorreo(), CODEPOS)
                .orElseThrow(() -> new RuntimeException("Correo o contraseña incorrectos"));

        if (!passwordEncoder.matches(request.getContrasena(), adoptante.getContrasena())) {
            throw new RuntimeException("Correo o contraseña incorrectos");
        }

        return new LoginResponse(
                adoptante.getIDADOPTANTE(),
                adoptante.getNombre(),
                adoptante.getCorreo(),
                adoptante.getRol()
        );
    }

    public AdoptanteModel buscarPorId(Integer id){
        return repository.findById(id).orElseThrow(() ->new RuntimeException(MSG14));
    }

    public List<AdoptanteModel> listar(){ return repository.findByEstado(CODEPOS);}

    public AdoptanteModel actualizar(Integer id, AdoptanteModel request) {

        AdoptanteModel adoptante = buscarPorId(id);
        adoptante.setNombre(request.getNombre());
        adoptante.setApellidoMaterno(request.getApellidoMaterno());
        adoptante.setApellidoPaterno(request.getApellidoPaterno());
        adoptante.setTelefono(request.getTelefono());
        adoptante.setCorreo(request.getCorreo());
        adoptante.setDireccion(request.getDireccion());

        return repository.save(adoptante);
    }

    public void eliminar(Integer id) {
        AdoptanteModel adoptante = buscarPorId(id);
        adoptante.setEstado(CODENEG);
        repository.save(adoptante);
    }
}
