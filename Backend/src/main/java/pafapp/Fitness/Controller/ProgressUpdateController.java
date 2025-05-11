package pafapp.Fitness.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pafapp.Fitness.Dto.ProgressUpdateDto;
import pafapp.Fitness.Service.ProgressUpdateService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    public ProgressUpdateDto createProgressUpdate(@RequestBody ProgressUpdateDto progressUpdateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName(); // Assuming username is userId

        progressUpdateDto.setUserId(userId); // Set from session/auth context

        return progressUpdateService.createProgressUpdate(progressUpdateDto);
    }

    @GetMapping("/{id}")
    public ProgressUpdateDto getProgressUpdateById(@PathVariable Long id) {
        return progressUpdateService.getProgressUpdateById(id);
    }

    @GetMapping
    public List<ProgressUpdateDto> getAllProgressUpdates(@RequestParam(required = false) String userId) {
        if (userId != null && !userId.isEmpty()) {
            return progressUpdateService.getProgressUpdatesByUserId(userId);
        }
        return progressUpdateService.getAllProgressUpdates();
    }

    @PutMapping("/{id}")
    public ProgressUpdateDto updateProgressUpdate(@PathVariable Long id, @RequestBody ProgressUpdateDto progressUpdateDto) {
        return progressUpdateService.updateProgressUpdate(id, progressUpdateDto);
    }

    @DeleteMapping("/{id}")
    public void deleteProgressUpdate(@PathVariable Long id) {
        progressUpdateService.deleteProgressUpdate(id);
    }
}