package pafapp.Fitness.Service.implementation;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pafapp.Fitness.Dto.ProgressUpdateDto;
import pafapp.Fitness.Model.ProgressUpdate;
import pafapp.Fitness.Service.ProgressUpdateService;
import pafapp.Fitness.repository.ProgressUpdateRepository; 


@Service 
public class ProgressUpdateServiceImpl implements ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Override
    public ProgressUpdateDto createProgressUpdate(ProgressUpdateDto progressUpdateDto) {
        ProgressUpdate progressUpdate = mapToEntity(progressUpdateDto);
        ProgressUpdate savedProgressUpdate = progressUpdateRepository.save(progressUpdate);
        return mapToDto(savedProgressUpdate);
    }

    @Override
    public ProgressUpdateDto getProgressUpdateById(Long id) {
        ProgressUpdate progressUpdate = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProgressUpdate not found with id " + id));
        return mapToDto(progressUpdate);
    }

    @Override
    public List<ProgressUpdateDto> getAllProgressUpdates() {
        List<ProgressUpdate> progressUpdates = progressUpdateRepository.findAll();
        return progressUpdates.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProgressUpdateDto updateProgressUpdate(Long id, ProgressUpdateDto progressUpdateDto) {
        ProgressUpdate existing = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProgressUpdate not found with id " + id));

        existing.setUserId(progressUpdateDto.getUserId());
        existing.setProgressTemplate(progressUpdateDto.getProgressTemplate());
        existing.setDetails(progressUpdateDto.getDetails());
        existing.setIsPrivate(progressUpdateDto.getIsPrivate());
        existing.setUpdatedAt(Instant.now());

        ProgressUpdate updated = progressUpdateRepository.save(existing);
        return mapToDto(updated);
    }

    @Override
    public void deleteProgressUpdate(Long id) {
        progressUpdateRepository.deleteById(id);
    }

    private ProgressUpdateDto mapToDto(ProgressUpdate progressUpdate) {
        ProgressUpdateDto dto = new ProgressUpdateDto();
        dto.setId(progressUpdate.getId());
        dto.setUserId(progressUpdate.getUserId());
        dto.setProgressTemplate(progressUpdate.getProgressTemplate());
        dto.setDetails(progressUpdate.getDetails());
        dto.setIsPrivate(progressUpdate.getIsPrivate());
        dto.setCreatedAt(progressUpdate.getCreatedAt());
        dto.setUpdatedAt(progressUpdate.getUpdatedAt());
        return dto;
    }

    private ProgressUpdate mapToEntity(ProgressUpdateDto dto) {
        ProgressUpdate entity = new ProgressUpdate();
        entity.setUserId(dto.getUserId());
        entity.setProgressTemplate(dto.getProgressTemplate());
        entity.setDetails(dto.getDetails());
        entity.setIsPrivate(dto.getIsPrivate());
        entity.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : Instant.now());
        entity.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : Instant.now());
        return entity;
    }

        @Override
    public List<ProgressUpdateDto> getProgressUpdatesByUserId(String userId) {
        List<ProgressUpdate> updates = progressUpdateRepository.findByUserId(userId);
        return updates.stream().map(this::mapToDto).collect(Collectors.toList());
}
}
