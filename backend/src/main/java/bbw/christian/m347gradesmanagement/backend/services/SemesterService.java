package bbw.christian.m347gradesmanagement.backend.services;

import bbw.christian.m347gradesmanagement.backend.models.Semester;
import bbw.christian.m347gradesmanagement.backend.repositories.SemesterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SemesterService {
    private final SemesterRepository semesterRepository;

    public SemesterService(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
    }

    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    public Semester getSemesterById(Long id) {
        return semesterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Semester not found with id " + id));
    }

    public Semester saveSemester(Semester semester) {
        return semesterRepository.save(semester);
    }

    public void deleteSemester(Long id) {
        Semester semester = getSemesterById(id);
        semesterRepository.delete(semester);
    }
}
