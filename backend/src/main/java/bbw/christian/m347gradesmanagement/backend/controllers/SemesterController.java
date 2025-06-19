package bbw.christian.m347gradesmanagement.backend.controllers;

import bbw.christian.m347gradesmanagement.backend.models.Semester;
import bbw.christian.m347gradesmanagement.backend.models.Space;
import bbw.christian.m347gradesmanagement.backend.services.SemesterService;
import bbw.christian.m347gradesmanagement.backend.services.SpaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/spaces/{spaceId}/semesters")
public class SemesterController {

    private final SemesterService semesterService;
    private final SpaceService spaceService;

    public SemesterController(SemesterService semesterService, SpaceService spaceService) {
        this.semesterService = semesterService;
        this.spaceService = spaceService;
    }

    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters(@PathVariable Long spaceId) {
        Space space = spaceService.getSpaceById(spaceId);
        List<Semester> semesters = space.getSemesters();
        return ResponseEntity.ok(semesters);
    }

    @GetMapping("/{semesterId}")
    public ResponseEntity<Semester> getSemesterById(@PathVariable Long spaceId, @PathVariable Long semesterId) {
        checkHierarchy(spaceId, semesterId);
        Semester semester = semesterService.getSemesterById(semesterId);
        return ResponseEntity.ok(semester);
    }

    @PostMapping
    public ResponseEntity<Semester> createSemester(@PathVariable Long spaceId, @RequestBody Semester semester) {
        Space space = spaceService.getSpaceById(spaceId);
        semester.setSpace(space);
        return ResponseEntity.status(HttpStatus.CREATED).body(semesterService.saveSemester(semester));
    }

    @PutMapping("/{semesterId}")
    public ResponseEntity<Semester> updateSemester(@PathVariable Long spaceId, @PathVariable Long semesterId, @RequestBody Semester updated) {
        checkHierarchy(spaceId, semesterId);
        Semester existing = semesterService.getSemesterById(semesterId);
        existing.setName(updated.getName());
        return ResponseEntity.ok(semesterService.saveSemester(existing));
    }

    @DeleteMapping("/{semesterId}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Long spaceId, @PathVariable Long semesterId) {
        checkHierarchy(spaceId, semesterId);
        semesterService.deleteSemester(semesterId);
        return ResponseEntity.noContent().build();
    }

    private void checkHierarchy(Long spaceId, Long semesterId) {
        Semester semester = semesterService.getSemesterById(semesterId);
        if (semester.getSpace().getId() != spaceId) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Semester " + semesterId + " does not belong to Space " + spaceId);
        }
    }
}
