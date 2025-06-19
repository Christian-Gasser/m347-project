package bbw.christian.m347gradesmanagement.backend.controllers;

import bbw.christian.m347gradesmanagement.backend.models.Semester;
import bbw.christian.m347gradesmanagement.backend.models.Subject;
import bbw.christian.m347gradesmanagement.backend.services.SemesterService;
import bbw.christian.m347gradesmanagement.backend.services.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/spaces/{spaceId}/semesters/{semesterId}/subjects")
public class SubjectController {

    private final SubjectService subjectService;
    private final SemesterService semesterService;

    public SubjectController(SubjectService subjectService, SemesterService semesterService) {
        this.subjectService = subjectService;
        this.semesterService = semesterService;
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects(@PathVariable Long spaceId, @PathVariable Long semesterId) {
        checkHierarchy(spaceId, semesterId, null);
        Semester semester = semesterService.getSemesterById(semesterId);
        List<Subject> subjects = semester.getSubjects();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId) {
        checkHierarchy(spaceId, semesterId, subjectId);
        Subject subject = subjectService.getSubjectById(subjectId);
        return ResponseEntity.ok(subject);
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@PathVariable Long spaceId, @PathVariable Long semesterId, @RequestBody Subject subject) {
        checkHierarchy(spaceId, semesterId, null);
        Semester semester = semesterService.getSemesterById(semesterId);
        subject.setSemester(semester);
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.saveSubject(subject));
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId, @RequestBody Subject updated) {
        checkHierarchy(spaceId, semesterId, subjectId);
        Subject existing = subjectService.getSubjectById(subjectId);
        existing.setName(updated.getName());
        return ResponseEntity.ok(subjectService.saveSubject(existing));
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId) {
        checkHierarchy(spaceId, semesterId, subjectId);
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.noContent().build();
    }

    private void checkHierarchy(Long spaceId, Long semesterId, Long subjectId) {
        Semester semester = semesterService.getSemesterById(semesterId);
        if (semester.getSpace().getId() != spaceId) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Semester " + semesterId + " does not belong to Space " + spaceId);
        }
        if (subjectId != null) {
            Subject subject = subjectService.getSubjectById(subjectId);
            if (subject.getSemester().getId() != semesterId) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Subject " + subjectId + " does not belong to Semester " + semesterId);
            }
        }
    }
}
