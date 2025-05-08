package pafapp.Fitness.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import pafapp.Fitness.Dto.ProgressUpdateDto;
import pafapp.Fitness.Service.ProgressUpdateService;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    public ProgressUpdateDto createProgressUpdate(@RequestBody ProgressUpdateDto progressUpdateDto) {
        return progressUpdateService.createProgressUpdate(progressUpdateDto);
    }

    @GetMapping("/{id}")
    public ProgressUpdateDto getProgressUpdateById(@PathVariable Long id) {
        return progressUpdateService.getProgressUpdateById(id);
    }

    @GetMapping
    public List<ProgressUpdateDto> getAllProgressUpdates() {
        return progressUpdateService.getAllProgressUpdates();
    }


    @PutMapping("/{id}")
    public ProgressUpdateDto updateProgressUpdate(@PathVariable Long id, @RequestBody ProgressUpdateDto progressUpdateDto) {
        return progressUpdateService.updateProgressUpdate(id, progressUpdateDto);
    }

    // ➡️ Delete a progress update
    @DeleteMapping("/{id}")
    public void deleteProgressUpdate(@PathVariable Long id) {
        progressUpdateService.deleteProgressUpdate(id);
    }
}
