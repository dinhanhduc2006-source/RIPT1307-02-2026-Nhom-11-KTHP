package com.lending.backend.service.impl;

import com.lending.backend.dto.BorrowCreateRequest;
import com.lending.backend.dto.BorrowRequestResponse;
import com.lending.backend.entity.BorrowRequest;
import com.lending.backend.entity.BorrowRequestItem;
import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.User;
import com.lending.backend.enums.BorrowItemStatus;
import com.lending.backend.enums.BorrowRequestStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.mapper.BorrowMapper;
import com.lending.backend.repository.BorrowRequestRepository;
import com.lending.backend.repository.EquipmentRepository;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.BorrowRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorrowRequestServiceImpl implements BorrowRequestService {

    private final BorrowRequestRepository borrowRequestRepository;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final BorrowMapper borrowMapper;

    @Override
    @Transactional
    public BorrowRequestResponse createRequest(Long userId, BorrowCreateRequest request) {
        if (request.getBorrowDate().isAfter(request.getReturnDate())) {
            throw new AppException(ErrorCode.INVALID_BORROW_DATE);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        BorrowRequest borrowRequest = BorrowRequest.builder()
                .user(user)
                .borrowDate(request.getBorrowDate())
                .returnDate(request.getReturnDate())
                .note(request.getNote())
                .priority(request.getPriority())
                .status(BorrowRequestStatus.pending)
                .build();

        List<BorrowRequestItem> items = request.getItems().stream().map(itemRequest -> {
            Equipment equipment = equipmentRepository.findById(itemRequest.getEquipmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
            
            return BorrowRequestItem.builder()
                    .request(borrowRequest)
                    .equipment(equipment)
                    .quantity(itemRequest.getQuantity())
                    .itemStatus(BorrowItemStatus.pending)
                    .build();
        }).collect(Collectors.toList());

        borrowRequest.setItems(items);
        return borrowMapper.toBorrowRequestResponse(borrowRequestRepository.save(borrowRequest));
    }

    @Override
    public List<BorrowRequestResponse> getRequestsByUser(Long userId) {
        return borrowRequestRepository.findByUserId(userId).stream()
                .map(borrowMapper::toBorrowRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BorrowRequestResponse> getAllRequests() {
        return borrowRequestRepository.findAll().stream()
                .map(borrowMapper::toBorrowRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BorrowRequestResponse updateRequestStatus(Long requestId, BorrowRequestStatus status, String adminNote, Long adminId) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        // Logic for stock update when approved/returned
        if (status == BorrowRequestStatus.approved && borrowRequest.getStatus() == BorrowRequestStatus.pending) {
            // Check stock and decrement
            for (BorrowRequestItem item : borrowRequest.getItems()) {
                Equipment equipment = item.getEquipment();
                if (equipment.getAvailableQuantity() < item.getQuantity()) {
                    throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                }
                equipment.setAvailableQuantity(equipment.getAvailableQuantity() - item.getQuantity());
                equipmentRepository.save(equipment);
            }
            borrowRequest.setApprovedBy(admin);
            borrowRequest.setApprovedAt(LocalDateTime.now());
        } else if (status == BorrowRequestStatus.returned && borrowRequest.getStatus() == BorrowRequestStatus.approved) {
            // Increment stock
            for (BorrowRequestItem item : borrowRequest.getItems()) {
                Equipment equipment = item.getEquipment();
                equipment.setAvailableQuantity(equipment.getAvailableQuantity() + item.getQuantity());
                equipmentRepository.save(equipment);
            }
        }

        borrowRequest.setStatus(status);
        borrowRequest.setAdminNote(adminNote);
        
        return borrowMapper.toBorrowRequestResponse(borrowRequestRepository.save(borrowRequest));
    }

    @Override
    public BorrowRequestResponse getRequestById(Long id) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return borrowMapper.toBorrowRequestResponse(borrowRequest);
    }
}
