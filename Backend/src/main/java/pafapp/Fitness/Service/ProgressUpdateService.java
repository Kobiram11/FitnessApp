package pafapp.Fitness.Service;

import java.util.List;

import pafapp.Fitness.Dto.ProgressUpdateDto;

public interface ProgressUpdateService {
    ProgressUpdateDto createProgressUpdate(ProgressUpdateDto progressUpdateDto);

    ProgressUpdateDto getProgressUpdateById(Long id);

    List<ProgressUpdateDto> getAllProgressUpdates();

    ProgressUpdateDto updateProgressUpdate(Long id, ProgressUpdateDto progressUpdateDto);

    void deleteProgressUpdate(Long id);
    List<ProgressUpdateDto> getProgressUpdatesByUserId(String userId);
}
