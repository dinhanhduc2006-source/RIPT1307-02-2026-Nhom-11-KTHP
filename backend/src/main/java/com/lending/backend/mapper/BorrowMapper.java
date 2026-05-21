package com.lending.backend.mapper;

import com.lending.backend.dto.BorrowItemResponse;
import com.lending.backend.dto.BorrowRequestResponse;
import com.lending.backend.entity.BorrowRequest;
import com.lending.backend.entity.BorrowRequestItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BorrowMapper {

    public BorrowRequestResponse toBorrowRequestResponse(BorrowRequest request) {
        if (request == null) return null;

        return BorrowRequestResponse.builder()
                .id(request.getId())
                .userFullName(request.getUser() != null ? request.getUser().getFullName() : null)
                .status(request.getStatus())
                .priority(request.getPriority())
                .borrowDate(request.getBorrowDate())
                .returnDate(request.getReturnDate())
                .note(request.getNote())
                .adminNote(request.getAdminNote())
                .items(request.getItems() != null ? 
                    request.getItems().stream()
                        .map(this::toBorrowItemResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    public BorrowItemResponse toBorrowItemResponse(BorrowRequestItem item) {
        if (item == null) return null;

        return BorrowItemResponse.builder()
                .id(item.getId())
                .equipmentName(item.getEquipment() != null ? item.getEquipment().getName() : null)
                .quantity(item.getQuantity())
                .itemStatus(item.getItemStatus())
                .conditionNote(item.getConditionNote())
                .build();
    }
}
