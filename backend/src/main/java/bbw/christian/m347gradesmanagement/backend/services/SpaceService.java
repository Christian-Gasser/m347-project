package bbw.christian.m347gradesmanagement.backend.services;

import bbw.christian.m347gradesmanagement.backend.models.Space;
import bbw.christian.m347gradesmanagement.backend.repositories.SpaceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SpaceService {
    private final SpaceRepository spaceRepository;

    public SpaceService(SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }

    public List<Space> getAllSpaces() {
        return spaceRepository.findAll();
    }

    public Space getSpaceById(Long id) {
        return spaceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Space not found with id " + id));
    }

    public Space saveSpace(Space space) {
        return spaceRepository.save(space);
    }

    public void deleteSpace(Long id) {
        Space space = getSpaceById(id);
        spaceRepository.delete(space);
    }
}
