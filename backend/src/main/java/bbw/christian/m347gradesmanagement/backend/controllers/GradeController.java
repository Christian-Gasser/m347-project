package bbw.christian.m347gradesmanagement.backend.controllers;

import bbw.christian.m347gradesmanagement.backend.models.Grade;
import bbw.christian.m347gradesmanagement.backend.models.Semester;
import bbw.christian.m347gradesmanagement.backend.models.Subject;
import bbw.christian.m347gradesmanagement.backend.services.GradeService;
import bbw.christian.m347gradesmanagement.backend.services.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/spaces/{spaceId}/semesters/{semesterId}/subjects/{subjectId}/grades")
public class GradeController {

    private final GradeService gradeService;
    private final SubjectService subjectService;

    public GradeController(GradeService gradeService, SubjectService subjectService) {
        this.gradeService = gradeService;
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<Grade>> getAllGrades(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId) {
        checkHierarchy(spaceId, semesterId, subjectId, null, null);
        Subject subject = subjectService.getSubjectById(subjectId);
        List<Grade> grades = subject.getGrades();
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/{gradeId}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId, @PathVariable Long gradeId) {
        checkHierarchy(spaceId, semesterId, subjectId, gradeId, null);
        Grade grade = gradeService.getGradeById(gradeId);
        return ResponseEntity.ok(grade);
    }

    @PostMapping
    public ResponseEntity<Grade> createGrade(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId, @RequestBody Grade grade) {
        checkHierarchy(spaceId, semesterId, subjectId, null, null);
        Subject subject = subjectService.getSubjectById(subjectId);
        grade.setSubject(subject);
        return ResponseEntity.status(HttpStatus.CREATED).body(gradeService.saveGrade(grade));
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId, @PathVariable Long gradeId, @RequestBody Grade updated) {
        checkHierarchy(spaceId, semesterId, subjectId, gradeId, null);
        Grade existing = gradeService.getGradeById(gradeId);
        existing.setName(updated.getName());
        existing.setExamDate(updated.getExamDate());
        existing.setGradeWeight(updated.getGradeWeight());
        existing.setGrade(updated.getGrade());
        return ResponseEntity.ok(gradeService.saveGrade(existing));
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long spaceId, @PathVariable Long semesterId, @PathVariable Long subjectId, @PathVariable Long gradeId) {
        checkHierarchy(spaceId, semesterId, subjectId, gradeId, null);
        gradeService.deleteGrade(gradeId);
        return ResponseEntity.noContent().build();
    }

    private void checkHierarchy(Long spaceId, Long semesterId, Long subjectId, Long gradeId, Long dummy) {
        Semester semester = subjectService.getSubjectById(subjectId).getSemester();
        if (semester.getId() != semesterId) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Subject " + subjectId + " does not belong to Semester " + semesterId);
        }
        if (semester.getSpace().getId() != spaceId) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Semester " + semesterId + " does not belong to Space " + spaceId);
        }
        if (gradeId != null) {
            Grade grade = gradeService.getGradeById(gradeId);
            if (grade.getSubject().getId() != subjectId) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Grade " + gradeId + " does not belong to Subject " + subjectId);
            }
        }
    }
}
