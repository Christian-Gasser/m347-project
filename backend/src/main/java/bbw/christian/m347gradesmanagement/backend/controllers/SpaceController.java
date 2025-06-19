package bbw.christian.m347gradesmanagement.backend.controllers;

import bbw.christian.m347gradesmanagement.backend.models.Space;
import bbw.christian.m347gradesmanagement.backend.services.SpaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @GetMapping
    public ResponseEntity<List<Space>> getAllSpaces() {
        return ResponseEntity.ok(spaceService.getAllSpaces());
    }

    @GetMapping("/{spaceId}")
    public ResponseEntity<Space> getSpaceById(@PathVariable Long spaceId) {
        return ResponseEntity.ok(spaceService.getSpaceById(spaceId));
    }

    @PostMapping
    public ResponseEntity<Space> createSpace(@RequestBody Space space) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spaceService.saveSpace(space));
    }

    @PutMapping("/{spaceId}")
    public ResponseEntity<Space> updateSpace(@PathVariable Long spaceId, @RequestBody Space updatedSpace) {
        Space existing = spaceService.getSpaceById(spaceId);
        existing.setName(updatedSpace.getName());
        return ResponseEntity.ok(spaceService.saveSpace(existing));
    }

    @DeleteMapping("/{spaceId}")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long spaceId) {
        spaceService.deleteSpace(spaceId);
        return ResponseEntity.noContent().build();
    }
}
